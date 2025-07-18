import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import List "mo:base/List";
import Array "mo:base/Array";
import Result "mo:base/Result";

actor {
    // --- TIPE DATA ---
    type HealthRecord = {
      id: Nat;
      owner: Principal;
      userName: Text;
      startDate: Int;
      endDate: ?Int;
      symptoms: Text;
      diagnosis: ?Text;
      createdAt: Int;
      updatedAt: Int;
    };
    type HealthRecordList = List.List<HealthRecord>;

    type User = {
        id: Principal;
        username: Text;
        email: Text;
        password: Text; 
    };
    type UserList = List.List<User>;

    // TAMBAHAN: Tipe data User tanpa password untuk dikirim ke frontend
    type PublicUser = {
        id: Principal;
        username: Text;
        email: Text;
    };

    // --- STATE (DATABASE) ---
    stable var records: HealthRecordList = List.nil<HealthRecord>();
    stable var nextId: Nat = 1;
    stable var users: UserList = List.nil<User>();
    // --- FUNGSI REGISTER ---
    public shared (msg) func register(username: Text, email: Text, password: Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        if (List.find<User>(users, func(u) { return u.id == caller or u.username == username; }) != null) {
            return #err("Principal atau Username sudah terdaftar.");
        };
        let newUser: User = { id = caller; username = username; email = email; password = password; };
        users := List.push<User>(newUser, users);
        return #ok("Pendaftaran berhasil! Silakan masuk.");
    };
    
    // --- TAMBAHAN: FUNGSI LOGIN ---
    public query func login(username: Text, password: Text) : async Result.Result<PublicUser, Text> {
        // Gunakan List.find untuk mencari user berdasarkan username
        let foundUser = List.find<User>(users, func(user) {
            return user.username == username;
        });

        switch (foundUser) {
            case (?user) {
                // Jika user ditemukan, cek password
                if (user.password == password) {
                    // Jika password cocok, buat objek PublicUser tanpa password
                    let publicProfile : PublicUser = {
                        id = user.id;
                        username = user.username;
                        email = user.email;
                    };
                    return #ok(publicProfile);
                } else {
                    return #err("Password salah.");
                };
            };
            case (null) {
                return #err("Username tidak ditemukan.");
            };
        };
    };
    
    // --- FUNGSI CREATE ---
    public shared (msg) func createRecord(
        userName: Text,
        startDate: Int,
        endDate: ?Int,
        symptoms: Text,
        diagnosis: ?Text
    ) : async HealthRecord {
        let now = Time.now();
        let callerPrincipal = msg.caller;
        let newRecord: HealthRecord = {
            id = nextId;
            owner = callerPrincipal;
            userName = userName;
            startDate = startDate;
            endDate = endDate;
            symptoms = symptoms;
            diagnosis = diagnosis;
            createdAt = now;
            updatedAt = now;
        };
        records := List.push<HealthRecord>(newRecord, records);
        nextId += 1;
        return newRecord;
    };

    // --- FUNGSI GET ALL ---
    public query (msg) func getRecords() : async [HealthRecord] {
        let callerPrincipal = msg.caller;
        let filteredList = List.filter<HealthRecord>(records, func(record) {
            return record.owner == callerPrincipal;
        });
        return List.toArray(filteredList);
    };

    // --- FUNGSI GET BY ID ---
    public query (msg) func getRecordById(id: Nat) : async ?HealthRecord {
        let callerPrincipal = msg.caller;
        let foundRecord = List.find<HealthRecord>(records, func(record) {
            return record.id == id;
        });
        switch (foundRecord) {
            case (?record) {
                if (record.owner == callerPrincipal) { return ?record; } else { return null; }
            };
            case null { return null; };
        };
    };

    // --- FUNGSI UPDATE ---
    public shared (msg) func updateRecord(
        id: Nat,
        newStartDate: Int,
        newEndDate: ?Int,
        newSymptoms: Text,
        newDiagnosis: ?Text
    ) : async Result.Result<HealthRecord, Text> {
        let foundRecord = List.find<HealthRecord>(records, func(r) { return r.id == id });
        switch (foundRecord) {
            case (?oldRecord) {
                if (oldRecord.owner != msg.caller) {
                    return #err("Anda tidak memiliki izin untuk mengedit catatan ini.");
                };
                // PERBAIKAN FINAL: Membuat record baru secara eksplisit
                let updatedRecord: HealthRecord = {
                    id = oldRecord.id;
                    owner = oldRecord.owner;
                    userName = oldRecord.userName;
                    startDate = newStartDate;
                    endDate = newEndDate;
                    symptoms = newSymptoms;
                    diagnosis = newDiagnosis;
                    createdAt = oldRecord.createdAt;
                    updatedAt = Time.now();
                };
                let listWithoutOld = List.filter<HealthRecord>(records, func(r) { return r.id != id });
                records := List.push<HealthRecord>(updatedRecord, listWithoutOld);
                return #ok(updatedRecord);
            };
            case null {
                return #err("Catatan dengan ID tersebut tidak ditemukan.");
            };
        };
    };
    
    // --- FUNGSI DELETE ---
    public shared (msg) func deleteRecord(id: Nat) : async Result.Result<Bool, Text> {
        let callerPrincipal = msg.caller;
        let foundRecord = List.find<HealthRecord>(records, func(r) { return r.id == id });
        switch (foundRecord) {
            case (?record) {
                if (record.owner != callerPrincipal) {
                    return #err("Anda tidak memiliki izin untuk menghapus catatan ini.");
                };
                records := List.filter<HealthRecord>(records, func(r) { return r.id != id; });
                return #ok(true);
};
            case (null) {
                return #err("Catatan dengan ID tersebut tidak ditemukan.");
            };
        };
    };
};