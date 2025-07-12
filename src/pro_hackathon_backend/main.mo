import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import List "mo:base/List";
import Array "mo:base/Array";
import Result "mo:base/Result";

actor {
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
    
    stable var records: HealthRecordList = List.nil<HealthRecord>();
    stable var nextId: Nat = 1;

    // --- FUNGSI CREATE (Tidak ada perubahan) ---
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

    // --- FUNGSI GET ALL (Tidak ada perubahan) ---
    public query (msg) func getRecords() : async [HealthRecord] {
        let callerPrincipal = msg.caller;
        let filteredList = List.filter<HealthRecord>(records, func(record) {
            return record.owner == callerPrincipal;
        });
        return List.toArray(filteredList);
    };

    // --- FUNGSI GET BY ID (Tidak ada perubahan) ---
    public query (msg) func getRecordById(id: Nat) : async ?HealthRecord {
        let callerPrincipal = msg.caller;
        let foundRecord = List.find<HealthRecord>(records, func(record) {
            return record.id == id;
        });
        switch (foundRecord) {
            case (?record) {
                if (record.owner == callerPrincipal) {
                    return ?record;
                } else {
                    return null;
                }
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
                    // PERBAIKAN: Gunakan #err dengan huruf kecil
                    return #err("Anda tidak memiliki izin untuk mengedit catatan ini.");
                };
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
                // PERBAIKAN: Gunakan #ok dengan huruf kecil
                return #ok(updatedRecord);
            };
            case null {
                return #err("Catatan dengan ID tersebut tidak ditemukan.");
            };
        };
    };
    public shared (msg) func deleteRecord(id: Nat) : async Result.Result<Bool, Text> {
        let callerPrincipal = msg.caller;

        // Cari record yang akan dihapus
        let foundRecord = List.find<HealthRecord>(records, func(r) { return r.id == id });

        switch (foundRecord) {
            case (?record) {
                // Verifikasi kepemilikan sebelum menghapus
                if (record.owner != callerPrincipal) {
                    return #err("Anda tidak memiliki izin untuk menghapus catatan ini.");
                };

                // Buat list baru yang tidak berisi record dengan ID yang akan dihapus
                records := List.filter<HealthRecord>(records, func(r) {
                    return r.id != id;
                });

                // Kembalikan 'true' jika sukses
                return #ok(true);
            };
            case (null) {
                return #err("Catatan dengan ID tersebut tidak ditemukan.");
            };
        };
    };
};