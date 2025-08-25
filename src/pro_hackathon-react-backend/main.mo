import Time "mo:base/Time";
import Principal "mo:base/Principal";
import TrieMap "mo:base/TrieMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

persistent actor backendHackathon {
  public type User = {
    nama : Text;
    riwayat : [Riwayat];
  };

  public type Riwayat = {
    penyakit : ?Text;
    gejala : Text;
    tanggal_mulai : Time.Time;
    tanggal_sembuh : ?Time.Time;
    catatan_dokter : ?Text;
  };

  stable var stableUsers : [(Principal, User)] = [];
  transient var users : TrieMap.TrieMap<Principal, User> = TrieMap.TrieMap(Principal.equal, Principal.hash);

  system func preupgrade() {
    stableUsers := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := TrieMap.fromEntries<Principal, User>(
      stableUsers.vals(),
      Principal.equal,
      Principal.hash,
    );
    stableUsers := [];
  };

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public query func getUserName(p : Principal) : async ?Text {
    switch (users.get(p)) {
      case (?user) { ?user.nama };
      case null { null };
    };
  };

  public func putUserName(p : Principal, newNama : Text) : async () {
    switch (users.get(p)) {
      case (?user) {
        let updated = { user with nama = newNama };
        users.put(p, updated);
      };
      case null {
        let newUser = {
          nama = newNama;
          riwayat = [];
        };
        users.put(p, newUser);
      };
    };
  };

  public func putRiwayat(
    p : Principal,
    penyakit : ?Text,
    gejala : Text,
    tanggal_mulai : Time.Time,
    tanggal_sembuh : ?Time.Time,
    catatan_dokter : ?Text,
  ) : async () {
    switch (users.get(p)) {
      case (?user) {
        let newRiwayat : Riwayat = {
          penyakit = penyakit;
          gejala = gejala;
          tanggal_mulai = tanggal_mulai;
          tanggal_sembuh = tanggal_sembuh;
          catatan_dokter = catatan_dokter;
        };
        users.put(
          p,
          {
            nama = user.nama;
            riwayat = Array.append(user.riwayat, [newRiwayat]);
          },
        );
      };
      case null {
        let newRiwayat : Riwayat = {
          penyakit = penyakit;
          gejala = gejala;
          tanggal_mulai = tanggal_mulai;
          tanggal_sembuh = tanggal_sembuh;
          catatan_dokter = catatan_dokter;
        };
        users.put(
          p,
          {
            nama = "";
            riwayat = [newRiwayat];
          },
        );
      };
    };
  };

  public query func getAllRiwayat(p : Principal) : async [Riwayat] {
    switch (users.get(p)) {
      case (?user) { user.riwayat };
      case null { [] };
    };
  };

  public query func getRiwayatByIndex(p : Principal, idx : Nat) : async ?Riwayat {
    switch (users.get(p)) {
      case (?user) {
        if (idx < user.riwayat.size()) {
          ?user.riwayat[idx];
        } else {
          null;
        };
      };
      case null { null };
    };
  };

  public func deleteRiwayat(p : Principal, idx : Nat) : async Bool {
    switch (users.get(p)) {
      case (?user) {
        if (idx < user.riwayat.size()) {
          let updatedRiwayat = Array.tabulate<Riwayat>(
            user.riwayat.size() - 1,
            func(i : Nat) : Riwayat {
              if (i < idx) { user.riwayat[i] } else { user.riwayat[i + 1] };
            },
          );
          users.put(p, { user with riwayat = updatedRiwayat });
          return true;
        } else {
          return false;
        };
      };
      case null { return false };
    };
  };

  public func updateRiwayat(
    p : Principal,
    idx : Nat,
    penyakit : ?Text,
    gejala : Text,
    tanggal_mulai : Time.Time,
    tanggal_sembuh : ?Time.Time,
    catatan_dokter : ?Text,
  ) : async Bool {
    switch (users.get(p)) {
      case (?user) {
        if (idx < user.riwayat.size()) {
          let updatedRiwayat : Riwayat = {
            penyakit = penyakit;
            gejala = gejala;
            tanggal_mulai = tanggal_mulai;
            tanggal_sembuh = tanggal_sembuh;
            catatan_dokter = catatan_dokter;
          };

          // replace di index tertentu
          let newRiwayat = Array.tabulate<Riwayat>(
            user.riwayat.size(),
            func(i : Nat) : Riwayat {
              if (i == idx) { updatedRiwayat } else { user.riwayat[i] };
            },
          );

          users.put(p, { user with riwayat = newRiwayat });
          return true;
        } else {
          return false;
        };
      };
      case null { return false };
    };
  };
};
