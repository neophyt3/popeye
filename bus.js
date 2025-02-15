const Cart = require("./cart");

class Bus {
  constructor(input) {
    this.input = input;
    this.ram = new Uint8Array(0x0800);
  }

  loadRom(file) {
    this.cart = new Cart(file);
  }

  read(address) {
    if (address >= 0x0000 && address <= 0x1fff) {
      return this.ram[address & 0x07ff];
    } else if (address >= 0x2000 && address <= 0x3fff) {
      // ppu here
    } else if (address >= 0x4016 && address <= 0x4017) {
      return this.input.read(address);
    } else if (address >= 0x8000 && address <= 0xffff) {
      return this.cart.cpu_read(address);
    }
  }

  write(address, data) {
    if (address >= 0x0000 && address <= 0x1fff) {
      this.ram[address & 0x7ff] = data;
    } else if (address >= 0x2000 && address <= 0x3fff) {
      // ppu here
    } else if (address >= 0x4016 && address <= 0x4017) {
      this.input.write(address);
    } else if (address >= 0x8000 && address <= 0xffff) {
      return this.cart.cpu_write(address);
    }
  }
}

module.exports = Bus;
