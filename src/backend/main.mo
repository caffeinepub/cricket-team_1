import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  public type Player = {
    name : Text;
    role : Role;
    jerseyNumber : Nat;
    bio : Text;
    photo : Storage.ExternalBlob;
  };

  public type Role = {
    #batsman : RoleInfo;
    #bowler : RoleInfo;
    #allRounder : RoleInfo;
    #wicketKeeper : RoleInfo;
  };

  module Player {
    public func compareByName(player1 : Player, player2 : Player) : Order.Order {
      Text.compare(player1.name, player2.name);
    };

    public func compareByJerseyNumber(player1 : Player, player2 : Player) : Order.Order {
      Nat.compare(player1.jerseyNumber, player2.jerseyNumber);
    };
  };

  public type RoleInfo = {};
  public type TeamProfile = {
    name : Text;
    tagline : Text;
    about : Text;
    logo : Storage.ExternalBlob;
  };

  let players = Map.empty<Text, Player>();

  var teamProfile : ?TeamProfile = null;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getTeamProfile() : async ?TeamProfile {
    teamProfile;
  };

  public shared ({ caller }) func updateTeamProfile(profile : TeamProfile) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update team profile");
    };
    teamProfile := ?profile;
  };

  public shared ({ caller }) func addPlayer(player : Player) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add players");
    };
    if (players.containsKey(player.name)) {
      Runtime.trap("Player already exists");
    };
    players.add(player.name, player);
  };

  public shared ({ caller }) func updatePlayer(player : Player) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update player");
    };
    if (not players.containsKey(player.name)) {
      Runtime.trap("Player does not exist");
    };
    players.add(player.name, player);
  };

  public shared ({ caller }) func removePlayer(name : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove player");
    };
    if (not players.containsKey(name)) {
      Runtime.trap("Player does not exist");
    };
    players.remove(name);
  };

  public query ({ caller }) func getAllPlayersSortedByName() : async [Player] {
    players.values().toArray().sort(Player.compareByName);
  };

  public query ({ caller }) func getAllPlayersSortedByJerseyNumber() : async [Player] {
    players.values().toArray().sort(Player.compareByJerseyNumber);
  };

  public query ({ caller }) func getPlayer(name : Text) : async ?Player {
    players.get(name);
  };

  public query ({ caller }) func getPlayersByRole(role : Role) : async [Player] {
    let filtered = players.values().filter(
      func(p) {
        p.role == role;
      }
    );
    filtered.toArray();
  };
};
