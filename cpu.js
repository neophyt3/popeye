// NES emulator

class Nes6502 {
  constructor(bus) {
    this.bus = bus;
    this.reset();
  }

  reset() {
    this.A = 0x00; // 8-bit accumulator
    this.X = 0x00; // 8-bit x register
    this.Y = 0x00; // 8-bit y register
    this.Stack = 0x00; // 8-bit stack
    this.Status = 0x00 | St.UN; // 8-bit flags

    var abs = 0xfffc;
    var lo = this.read(abs + 0);
    var hi = this.read(abs + 1);
    this.PC = (hi << 8) | lo; // 16-bit program counter
  }

  setStatus(flag) {
    this.Status |= flag;
  }

  clearStatus(flag) {
    this.Status &= ~flag;
  }

  getStatus(flag) {
    return (this.Status & flag) != 0;
  }

  read(address) {
    return this.bus.read(address);
  }

  write(address, data) {
    this.bus.write(address, data);
  }

  execute(ins) {
    switch (ins) {
      case 0xa2: // LDX
        // store the next value into X
        this.X = this.read(this.PC);
        this.PC++;
        break;
      case 0x8e: // STX
        // read the address
        var lo = this.read(this.PC);
        this.PC++;
        var hi = this.read(this.PC);
        this.PC++;
        //  hi 0x80 0001000b
        //  lo 0x40 0000100b
        //  hi << 8 0x8000 000100000000000b
        //  lo      0x0040 000000000000100b
        //  hi | lo 0x8040 000100000000100b
        var addr = (hi << 8) | lo;
        // store the value at X into address
        this.write(addr, this.X);
        break;
        case 0xac: // LDY
        // store the next value into Y
        this.Y = this.read(this.PC);
        this.PC++;
        break;
        case 0xa9: // LDA
        // store the next value into A
        this.A = this.read(this.PC);
        this.PC++;
        break;
        case 0x18: // CLC
        // Clear Carry flag, set to 0
        St.CARRY = 0
        this.PC++;
        break;
        //note : does "LOOP" need a case here? 
        case 0xa9: // ADC
        // Add to accumulator with a Carry
        // This instruction adds the contents of a memory location to the accumulator together with the carry bit. If overflow occurs the carry bit is set, this enables multiple byte addition to be performed.

        let aLimit = 100 // I don't know at what number means overflow occurs
        let combinedBits = this.read(this.A) + St.CARRY;
        if (combinedBits > aLimit){
           this.A = aLimit;
           St.CARRY = combinedBits - aLimit;
        }
        else {
          this.A = combinedBits;
        }
        // additional instructions for ADC:
        // Zero Flag	Set if A = 0
        // Overflow Flag	Set if sign bit is incorrect
        // Negative Flag	Set if bit 7 set
        this.PC++;
        break;
        case 0x88: // DEY
        // Subtracts one from the Y register setting the zero and negative flags as appropriate.
        this.Y--;
        if (Y === 0){
          //set zero flag if Y is zero
        }
        //additional instruction:
        // Negative FlagSet if bit 7 of Y is set
        this.PC++;
        break;
        case 0xd0: // BNE (loop)
        // If the zero flag is clear then add the relative displacement to the program counter to cause a branch to a new location. Unsure how to do this
        // this.Y = 0x00
        this.PC++;
        break;
        case 0x8d: // STA
        // read the address
        var lo = this.read(this.PC);
        this.PC++;
        var hi = this.read(this.PC);
        this.PC++;
        var addr = (hi << 8) | lo;
        // store the value at A into address
        this.write(addr, this.A);
        break;
        case 0x88: // NOP
        // No operation PC++ and nothing else
        this.PC++;
        break;
      default:
        console.log("unknown instruction");
        break;
    }
  }


  clock() {
    let ins = this.read(this.PC);
    this.PC++;
    this.execute(ins);
  }
}

const St = {
  CARRY: 1 << 0,
  ZERO: 1 << 1,
  INTD: 1 << 2,
  DEC: 1 << 3,
  BREAK: 1 << 4,
  UN: 1 << 5,
  OVER: 1 << 6,
  NEG: 1 << 7,
};

module.exports = Nes6502;
