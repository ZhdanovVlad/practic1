class Room {
  constructor({ id, name, roomType, capacity, address }) {
    this.id = id;
    this.name = name;
    this.roomType = roomType;
    this.capacity = capacity;
    this.address = address;
  }

  static fromRow(row) {
    if (!row) {
      return null;
    }
    return new Room({
      id: row.id,
      name: row.name,
      roomType: row.room_type,
      capacity: row.capacity,
      address: row.address
    });
  }

  toPublic() {
    return {
      id: this.id,
      name: this.name,
      roomType: this.roomType,
      capacity: this.capacity,
      address: this.address
    };
  }
}

module.exports = Room;
