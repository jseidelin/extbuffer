/* eslint-env mocha */

"use strict";

const ExtBuffer = require("../index.js");
const expect = require("expect");

describe("ExtBuffer", function() {

    beforeEach(function() {

    });

    it("should be able to create new buffer object", function() {
        var buffer = new ExtBuffer(10);
        expect(Buffer.isBuffer(buffer)).toEqual(true);
        expect(buffer.length).toEqual(10);
    });

    it("should be able to create new buffer object from other buffer", function() {
        var buffer = new Buffer(40);
        var buffer2 = new ExtBuffer(buffer);
        expect(Buffer.isBuffer(buffer2)).toEqual(true);
        expect(buffer.length).toEqual(40);
    });


    it("should be able to convert buffer to Array", function() {
        var buffer = new ExtBuffer([
            0x00, 0x00, 0x00, 0x00,
            0x78, 0xB3, 0xCB, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        expect(buffer.toArray()).toEqual([
            0x00, 0x00, 0x00, 0x00,
            0x78, 0xB3, 0xCB, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);
    });

    it("should be able to read unsigned, little-endian 24-bit integer values", function() {
        var buffer = new ExtBuffer([
            0x71, 0x5E, 0xDA, 0xA5,
            0x78, 0xB3, 0xCB, 0x39,
            0x00, 0x00, 0x00, 0x00,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        expect(buffer.readUInt24LE(0)).toEqual(14311025);
        expect(buffer.readUInt24LE(4)).toEqual(13349752);
        expect(buffer.readUInt24LE(8)).toEqual(0);
        expect(buffer.readUInt24LE(12)).toEqual(16777215);
    });

    it("should be able to read signed, little-endian 24-bit integer values", function() {
        var buffer = new ExtBuffer([
            0x71, 0x5E, 0xDA, 0xA5,
            0x78, 0xB3, 0xCB, 0x39,
            0x00, 0x00, 0x00, 0x00,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        expect(buffer.readInt24LE(0)).toEqual(-2466191);
        expect(buffer.readInt24LE(4)).toEqual(-3427464);
        expect(buffer.readInt24LE(8)).toEqual(0);
        expect(buffer.readInt24LE(12)).toEqual(-1);
    });

    it("should be able to write unsigned, little-endian 24-bit integer values", function() {
        var buffer = new ExtBuffer([
            0x00, 0x00, 0x00, 0x00,
            0x78, 0xB3, 0xCB, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeUInt24LE(16777215, 0);
        expect(buffer.toArray()).toEqual([
            0xFF, 0xFF, 0xFF, 0x00,
            0x78, 0xB3, 0xCB, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeUInt24LE(0, 4);
        expect(buffer.toArray()).toEqual([
            0xFF, 0xFF, 0xFF, 0x00,
            0x00, 0x00, 0x00, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeUInt24LE(14311025, 8);
        expect(buffer.toArray()).toEqual([
            0xFF, 0xFF, 0xFF, 0x00,
            0x00, 0x00, 0x00, 0x39,
            0x71, 0x5E, 0xDA, 0xFF
        ]);
    });

    it("should be able to read unsigned, big-endian 24-bit integer values", function() {
        var buffer = new ExtBuffer([
            0x78, 0xB3, 0xCB, 0x39,
            0x00, 0x00, 0x00, 0x00,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        expect(buffer.readUInt24BE(0)).toEqual(7910347);
        expect(buffer.readUInt24BE(4)).toEqual(0);
        expect(buffer.readUInt24BE(8)).toEqual(16777215);
    });


    it("should be able to write unsigned, big-endian 24-bit integer values", function() {
        var buffer = new ExtBuffer([
            0x00, 0x00, 0x00, 0x00,
            0x78, 0xB3, 0xCB, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeUInt24BE(16777215, 0);
        expect(buffer.toArray()).toEqual([
            0xFF, 0xFF, 0xFF, 0x00,
            0x78, 0xB3, 0xCB, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeUInt24BE(0, 4);
        expect(buffer.toArray()).toEqual([
            0xFF, 0xFF, 0xFF, 0x00,
            0x00, 0x00, 0x00, 0x39,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeUInt24BE(14311025, 8);
        expect(buffer.toArray()).toEqual([
            0xFF, 0xFF, 0xFF, 0x00,
            0x00, 0x00, 0x00, 0x39,
            0xDA, 0x5E, 0x71, 0xFF
        ]);
    });

    it("should be able to write little-endian, length-prefixed strings", function() {
        var buffer = new ExtBuffer([
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00
        ]);

        buffer.writePrefixedStringLE("This is a string!", 0, "utf8");

        expect(buffer.toArray()).toEqual([
            0x11, 0x00, 0x00, 0x00, 
            0x54, 0x68, 0x69, 0x73, 
            0x20, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74, 
            0x72, 0x69, 0x6e, 0x67, 
            0x21, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00
        ]);
    });


    it("should be able to read little-endian, length-prefixed string", function() {
        var buffer = new ExtBuffer([
            0x11, 0x00, 0x00, 0x00, 
            0x54, 0x68, 0x69, 0x73, 
            0x20, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74, 
            0x72, 0x69, 0x6e, 0x67, 
            0x21, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00
        ]);
        expect(buffer.readPrefixedStringLE(0, "utf8")).toEqual("This is a string!");
    });


    it("should be able to write big-endian, length-prefixed string", function() {
        var buffer = new ExtBuffer([
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00
        ]);

        buffer.writePrefixedStringBE("This is a string!", 0, "utf8");

        expect(buffer.toArray()).toEqual([
            0x00, 0x00, 0x00, 0x11, 
            0x54, 0x68, 0x69, 0x73, 
            0x20, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74, 
            0x72, 0x69, 0x6e, 0x67, 
            0x21, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00
        ]);
    });


    it("should be able to read big-endian, length-prefixed string", function() {
        var buffer = new ExtBuffer([
            0x00, 0x00, 0x00, 0x11, 
            0x54, 0x68, 0x69, 0x73, 
            0x20, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74, 
            0x72, 0x69, 0x6e, 0x67, 
            0x21, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00
        ]);
        expect(buffer.readPrefixedStringBE(0, "utf8")).toEqual("This is a string!");
    });

    it("should be able to write null-terminated strings", function() {
        var buffer = new ExtBuffer([
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeNullTerminatedString("This is a string!", 0);

        expect(buffer.toArray()).toEqual([
            0x54, 0x68, 0x69, 0x73, 
            0x20, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74, 
            0x72, 0x69, 0x6e, 0x67, 
            0x21, 0x00, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeNullTerminatedString("", 4);

        expect(buffer.toArray()).toEqual([
            0x54, 0x68, 0x69, 0x73, 
            0x00, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74, 
            0x72, 0x69, 0x6e, 0x67, 
            0x21, 0x00, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

    });

    it("should be able to read null-terminated strings", function() {
        var buffer = new ExtBuffer([
            0x54, 0x68, 0x69, 0x73, 
            0x20, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74, 
            0x72, 0x69, 0x6e, 0x67, 
            0x21, 0x00, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF
        ]);
        expect(buffer.readNullTerminatedString(0)).toEqual("This is a string!");
        expect(buffer.readNullTerminatedString(17)).toEqual("");
    });

    it("should be able to write boolean values", function() {
        var buffer = new ExtBuffer([
            0xFF, 0xFF, 0xFF, 0xFF
        ]);

        buffer.writeBoolean(false, 1);
        buffer.writeBoolean(true, 3);

        expect(buffer.toArray()).toEqual([
            0xFF, 0x00, 0xFF, 0x01
        ]);
    });

    it("should be able to read boolean values", function() {
        var buffer = new ExtBuffer([
            0x33, 0x00, 0xFF, 0x01
        ]);

        expect(buffer.readBoolean(0)).toEqual(true);
        expect(buffer.readBoolean(1)).toEqual(false);
        expect(buffer.readBoolean(2)).toEqual(true);
        expect(buffer.readBoolean(3)).toEqual(true);
    });

    it("should be able to read bytes", function() {
        var buffer = new ExtBuffer([
            0x54, 0x68, 0x69, 0x73,
            0x20, 0x69, 0x73, 0x20,
            0x61, 0x20, 0x73, 0x74,
            0x72, 0x69, 0x6e, 0x67
        ]);
        expect(buffer.readBytes(4, 8).toArray()).toEqual([
            0x20, 0x69, 0x73, 0x20, 
            0x61, 0x20, 0x73, 0x74
        ]);

        expect(buffer.readBytes(8, 0).toArray()).toEqual([]);
    });

    it("should be able to write bytes", function() {
        var buffer = new ExtBuffer([
            0x54, 0x68, 0x69, 0x73,
            0x20, 0x69, 0x73, 0x20,
            0x61, 0x20, 0x73, 0x74
        ]);

        buffer.writeBytes(new ExtBuffer([0x01, 0x02, 0x03, 0x04]), 4);

        expect(buffer.toArray()).toEqual([
            0x54, 0x68, 0x69, 0x73,
            0x01, 0x02, 0x03, 0x04,
            0x61, 0x20, 0x73, 0x74
        ]);

        buffer.writeBytes(new ExtBuffer([]), 8);

        expect(buffer.toArray()).toEqual([
            0x54, 0x68, 0x69, 0x73,
            0x01, 0x02, 0x03, 0x04,
            0x61, 0x20, 0x73, 0x74
        ]);
    });

    it("should be able to write bytes with specified length", function() {
        var buffer = new ExtBuffer([
            0x54, 0x68, 0x69, 0x73,
            0x20, 0x69, 0x73, 0x20,
            0x61, 0x20, 0x73, 0x74
        ]);

        buffer.writeBytes(new ExtBuffer([0x01, 0x02, 0x03, 0x04]), 4, 2);

        expect(buffer.toArray()).toEqual([
            0x54, 0x68, 0x69, 0x73,
            0x01, 0x02, 0x73, 0x20,
            0x61, 0x20, 0x73, 0x74
        ]);

        buffer.writeBytes(new ExtBuffer([0x01, 0x02, 0x03, 0x04]), 4, 6);

        expect(buffer.toArray()).toEqual([
            0x54, 0x68, 0x69, 0x73,
            0x01, 0x02, 0x03, 0x04,
            0x61, 0x20, 0x73, 0x74
        ]);
    });


    it("should be able to read little-endian, 16-bit float values", function() {
        var buffer = new ExtBuffer([
            0x00, 0xC0,
            0xFF, 0x7B,
            0x00, 0x04,
            0x01, 0x00,
            0x00, 0x00,
            0x00, 0x80,
            0x00, 0x7C,
            0x00, 0xFC,
            0x55, 0x35,
            0x01, 0x7C,
            0x01, 0xFC
        ]);

        expect(buffer.readFloat16LE(0)).toEqual(-2);
        expect(buffer.readFloat16LE(2)).toEqual(65504);
        expect(buffer.readFloat16LE(4)).toEqual(Math.pow(2, -14));
        expect(buffer.readFloat16LE(6)).toEqual(Math.pow(2, -24));
        expect(buffer.readFloat16LE(8)).toEqual(0);
        expect(buffer.readFloat16LE(10)).toEqual(0);
        expect(1 / buffer.readFloat16LE(10)).toEqual(-Infinity); // (1/-0) === -Infinity
        expect(buffer.readFloat16LE(12)).toEqual(Infinity);
        expect(buffer.readFloat16LE(14)).toEqual(-Infinity);
        expect(Math.abs(0.333252 - buffer.readFloat16LE(16))).toBeLessThan(0.000001);
        expect(isNaN(buffer.readFloat16LE(18))).toEqual(true);
        expect(isNaN(buffer.readFloat16LE(20))).toEqual(true);
    });

    it("should be able to read big-endian, 16-bit float values", function() {
        var buffer = new ExtBuffer([
            0xC0, 0x00,
            0x7B, 0xFF,
            0x04, 0x00,
            0x00, 0x01,
            0x00, 0x00,
            0x80, 0x00,
            0x7C, 0x00,
            0xFC, 0x00,
            0x35, 0x55,
            0x7C, 0x01,
            0xFC, 0x01
        ]);

        expect(buffer.readFloat16BE(0)).toEqual(-2);
        expect(buffer.readFloat16BE(2)).toEqual(65504);
        expect(buffer.readFloat16BE(4)).toEqual(Math.pow(2, -14));
        expect(buffer.readFloat16BE(6)).toEqual(Math.pow(2, -24));
        expect(buffer.readFloat16BE(8)).toEqual(0);
        expect(buffer.readFloat16BE(10)).toEqual(0);
        expect(1 / buffer.readFloat16BE(10)).toEqual(-Infinity); // (1/-0) === -Infinity
        expect(buffer.readFloat16BE(12)).toEqual(Infinity);
        expect(buffer.readFloat16BE(14)).toEqual(-Infinity);
        expect(Math.abs(0.333252 - buffer.readFloat16BE(16))).toBeLessThan(0.000001);
        expect(isNaN(buffer.readFloat16BE(18))).toEqual(true);
        expect(isNaN(buffer.readFloat16BE(20))).toEqual(true);
    });


    it("should be able to write little-endian, 16-bit float values", function() {
        var buffer = new ExtBuffer(2);
        
        buffer.writeFloat16LE(-2, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0xC0]);

        buffer.writeFloat16LE(65504, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0xFF, 0x7B]);

        buffer.writeFloat16LE(Math.pow(2, -14), 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0x04]);

        buffer.writeFloat16LE(Math.pow(2, -24), 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x01, 0x00]);

        buffer.writeFloat16LE(0, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0x00]);

        buffer.writeFloat16LE(-0, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0x80]);

        buffer.writeFloat16LE(Infinity, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0x7C]);

        buffer.writeFloat16LE(-Infinity, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0xFC]);

        buffer.writeFloat16LE(0.333252, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x55, 0x35]);

        buffer.writeFloat16LE(NaN, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x01, 0x7C]);
    });

    it("should be able to write big-endian, 16-bit float values", function() {
        var buffer = new ExtBuffer(2);
        
        buffer.writeFloat16BE(-2, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0xC0, 0x00]);

        buffer.writeFloat16BE(65504, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x7B, 0xFF]);

        buffer.writeFloat16BE(Math.pow(2, -14), 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x04, 0x00]);

        buffer.writeFloat16BE(Math.pow(2, -24), 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0x01]);

        buffer.writeFloat16BE(0, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x00, 0x00]);

        buffer.writeFloat16BE(-0, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x80, 0x00]);

        buffer.writeFloat16BE(Infinity, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x7C, 0x00]);

        buffer.writeFloat16BE(-Infinity, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0xFC, 0x00]);

        buffer.writeFloat16BE(0.333252, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x35, 0x55]);

        buffer.writeFloat16BE(NaN, 0);
        expect(buffer.readBytes(0, 2).toArray()).toEqual([0x7C, 0x01]);
    });

});