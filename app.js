// --- Extracted Script 1 ---
const originalWarn = console.warn;
console.warn = function () {
  if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].indexOf('cdn.tailwindcss.com should not be used in production') !== -1) return;
  originalWarn.apply(console, arguments);
};

// --- Extracted Script 2 ---
var QRCode; !function () { function a(a) { this.mode = c.MODE_8BIT_BYTE, this.data = a, this.parsedData = []; for (var b = [], d = 0, e = this.data.length; e > d; d++) { var f = this.data.charCodeAt(d); f > 65536 ? (b[0] = 240 | (1835008 & f) >>> 18, b[1] = 128 | (258048 & f) >>> 12, b[2] = 128 | (4032 & f) >>> 6, b[3] = 128 | 63 & f) : f > 2048 ? (b[0] = 224 | (61440 & f) >>> 12, b[1] = 128 | (4032 & f) >>> 6, b[2] = 128 | 63 & f) : f > 128 ? (b[0] = 192 | (1984 & f) >>> 6, b[1] = 128 | 63 & f) : b[0] = f, this.parsedData = this.parsedData.concat(b) } this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239)) } function b(a, b) { this.typeNumber = a, this.errorCorrectLevel = b, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = [] } function i(a, b) { if (void 0 == a.length) throw new Error(a.length + "/" + b); for (var c = 0; c < a.length && 0 == a[c];)c++; this.num = new Array(a.length - c + b); for (var d = 0; d < a.length - c; d++)this.num[d] = a[d + c] } function j(a, b) { this.totalCount = a, this.dataCount = b } function k() { this.buffer = [], this.length = 0 } function m() { return "undefined" != typeof CanvasRenderingContext2D } function n() { var a = !1, b = navigator.userAgent; return /android/i.test(b) && (a = !0, aMat = b.toString().match(/android ([0-9]\.[0-9])/i), aMat && aMat[1] && (a = parseFloat(aMat[1]))), a } function r(a, b) { for (var c = 1, e = s(a), f = 0, g = l.length; g >= f; f++) { var h = 0; switch (b) { case d.L: h = l[f][0]; break; case d.M: h = l[f][1]; break; case d.Q: h = l[f][2]; break; case d.H: h = l[f][3] }if (h >= e) break; c++ } if (c > l.length) throw new Error("Too long data"); return c } function s(a) { var b = encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g, "a"); return b.length + (b.length != a ? 3 : 0) } a.prototype = { getLength: function () { return this.parsedData.length }, write: function (a) { for (var b = 0, c = this.parsedData.length; c > b; b++)a.put(this.parsedData[b], 8) } }, b.prototype = { addData: function (b) { var c = new a(b); this.dataList.push(c), this.dataCache = null }, isDark: function (a, b) { if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b) throw new Error(a + "," + b); return this.modules[a][b] }, getModuleCount: function () { return this.moduleCount }, make: function () { this.makeImpl(!1, this.getBestMaskPattern()) }, makeImpl: function (a, c) { this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount); for (var d = 0; d < this.moduleCount; d++) { this.modules[d] = new Array(this.moduleCount); for (var e = 0; e < this.moduleCount; e++)this.modules[d][e] = null } this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(a, c), this.typeNumber >= 7 && this.setupTypeNumber(a), null == this.dataCache && (this.dataCache = b.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, c) }, setupPositionProbePattern: function (a, b) { for (var c = -1; 7 >= c; c++)if (!(-1 >= a + c || this.moduleCount <= a + c)) for (var d = -1; 7 >= d; d++)-1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d ? !0 : !1) }, getBestMaskPattern: function () { for (var a = 0, b = 0, c = 0; 8 > c; c++) { this.makeImpl(!0, c); var d = f.getLostPoint(this); (0 == c || a > d) && (a = d, b = c) } return b }, createMovieClip: function (a, b, c) { var d = a.createEmptyMovieClip(b, c), e = 1; this.make(); for (var f = 0; f < this.modules.length; f++)for (var g = f * e, h = 0; h < this.modules[f].length; h++) { var i = h * e, j = this.modules[f][h]; j && (d.beginFill(0, 100), d.moveTo(i, g), d.lineTo(i + e, g), d.lineTo(i + e, g + e), d.lineTo(i, g + e), d.endFill()) } return d }, setupTimingPattern: function () { for (var a = 8; a < this.moduleCount - 8; a++)null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2); for (var b = 8; b < this.moduleCount - 8; b++)null == this.modules[6][b] && (this.modules[6][b] = 0 == b % 2) }, setupPositionAdjustPattern: function () { for (var a = f.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++)for (var c = 0; c < a.length; c++) { var d = a[b], e = a[c]; if (null == this.modules[d][e]) for (var g = -2; 2 >= g; g++)for (var h = -2; 2 >= h; h++)this.modules[d + g][e + h] = -2 == g || 2 == g || -2 == h || 2 == h || 0 == g && 0 == h ? !0 : !1 } }, setupTypeNumber: function (a) { for (var b = f.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) { var d = !a && 1 == (1 & b >> c); this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d } for (var c = 0; 18 > c; c++) { var d = !a && 1 == (1 & b >> c); this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d } }, setupTypeInfo: function (a, b) { for (var c = this.errorCorrectLevel << 3 | b, d = f.getBCHTypeInfo(c), e = 0; 15 > e; e++) { var g = !a && 1 == (1 & d >> e); 6 > e ? this.modules[e][8] = g : 8 > e ? this.modules[e + 1][8] = g : this.modules[this.moduleCount - 15 + e][8] = g } for (var e = 0; 15 > e; e++) { var g = !a && 1 == (1 & d >> e); 8 > e ? this.modules[8][this.moduleCount - e - 1] = g : 9 > e ? this.modules[8][15 - e - 1 + 1] = g : this.modules[8][15 - e - 1] = g } this.modules[this.moduleCount - 8][8] = !a }, mapData: function (a, b) { for (var c = -1, d = this.moduleCount - 1, e = 7, g = 0, h = this.moduleCount - 1; h > 0; h -= 2)for (6 == h && h--; ;) { for (var i = 0; 2 > i; i++)if (null == this.modules[d][h - i]) { var j = !1; g < a.length && (j = 1 == (1 & a[g] >>> e)); var k = f.getMask(b, d, h - i); k && (j = !j), this.modules[d][h - i] = j, e--, -1 == e && (g++, e = 7) } if (d += c, 0 > d || this.moduleCount <= d) { d -= c, c = -c; break } } } }, b.PAD0 = 236, b.PAD1 = 17, b.createData = function (a, c, d) { for (var e = j.getRSBlocks(a, c), g = new k, h = 0; h < d.length; h++) { var i = d[h]; g.put(i.mode, 4), g.put(i.getLength(), f.getLengthInBits(i.mode, a)), i.write(g) } for (var l = 0, h = 0; h < e.length; h++)l += e[h].dataCount; if (g.getLengthInBits() > 8 * l) throw new Error("code length overflow. (" + g.getLengthInBits() + ">" + 8 * l + ")"); for (g.getLengthInBits() + 4 <= 8 * l && g.put(0, 4); 0 != g.getLengthInBits() % 8;)g.putBit(!1); for (; ;) { if (g.getLengthInBits() >= 8 * l) break; if (g.put(b.PAD0, 8), g.getLengthInBits() >= 8 * l) break; g.put(b.PAD1, 8) } return b.createBytes(g, e) }, b.createBytes = function (a, b) { for (var c = 0, d = 0, e = 0, g = new Array(b.length), h = new Array(b.length), j = 0; j < b.length; j++) { var k = b[j].dataCount, l = b[j].totalCount - k; d = Math.max(d, k), e = Math.max(e, l), g[j] = new Array(k); for (var m = 0; m < g[j].length; m++)g[j][m] = 255 & a.buffer[m + c]; c += k; var n = f.getErrorCorrectPolynomial(l), o = new i(g[j], n.getLength() - 1), p = o.mod(n); h[j] = new Array(n.getLength() - 1); for (var m = 0; m < h[j].length; m++) { var q = m + p.getLength() - h[j].length; h[j][m] = q >= 0 ? p.get(q) : 0 } } for (var r = 0, m = 0; m < b.length; m++)r += b[m].totalCount; for (var s = new Array(r), t = 0, m = 0; d > m; m++)for (var j = 0; j < b.length; j++)m < g[j].length && (s[t++] = g[j][m]); for (var m = 0; e > m; m++)for (var j = 0; j < b.length; j++)m < h[j].length && (s[t++] = h[j][m]); return s }; for (var c = { MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8 }, d = { L: 1, M: 0, Q: 3, H: 2 }, e = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 }, f = { PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]], G15: 1335, G18: 7973, G15_MASK: 21522, getBCHTypeInfo: function (a) { for (var b = a << 10; f.getBCHDigit(b) - f.getBCHDigit(f.G15) >= 0;)b ^= f.G15 << f.getBCHDigit(b) - f.getBCHDigit(f.G15); return (a << 10 | b) ^ f.G15_MASK }, getBCHTypeNumber: function (a) { for (var b = a << 12; f.getBCHDigit(b) - f.getBCHDigit(f.G18) >= 0;)b ^= f.G18 << f.getBCHDigit(b) - f.getBCHDigit(f.G18); return a << 12 | b }, getBCHDigit: function (a) { for (var b = 0; 0 != a;)b++, a >>>= 1; return b }, getPatternPosition: function (a) { return f.PATTERN_POSITION_TABLE[a - 1] }, getMask: function (a, b, c) { switch (a) { case e.PATTERN000: return 0 == (b + c) % 2; case e.PATTERN001: return 0 == b % 2; case e.PATTERN010: return 0 == c % 3; case e.PATTERN011: return 0 == (b + c) % 3; case e.PATTERN100: return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2; case e.PATTERN101: return 0 == b * c % 2 + b * c % 3; case e.PATTERN110: return 0 == (b * c % 2 + b * c % 3) % 2; case e.PATTERN111: return 0 == (b * c % 3 + (b + c) % 2) % 2; default: throw new Error("bad maskPattern:" + a) } }, getErrorCorrectPolynomial: function (a) { for (var b = new i([1], 0), c = 0; a > c; c++)b = b.multiply(new i([1, g.gexp(c)], 0)); return b }, getLengthInBits: function (a, b) { if (b >= 1 && 10 > b) switch (a) { case c.MODE_NUMBER: return 10; case c.MODE_ALPHA_NUM: return 9; case c.MODE_8BIT_BYTE: return 8; case c.MODE_KANJI: return 8; default: throw new Error("mode:" + a) } else if (27 > b) switch (a) { case c.MODE_NUMBER: return 12; case c.MODE_ALPHA_NUM: return 11; case c.MODE_8BIT_BYTE: return 16; case c.MODE_KANJI: return 10; default: throw new Error("mode:" + a) } else { if (!(41 > b)) throw new Error("type:" + b); switch (a) { case c.MODE_NUMBER: return 14; case c.MODE_ALPHA_NUM: return 13; case c.MODE_8BIT_BYTE: return 16; case c.MODE_KANJI: return 12; default: throw new Error("mode:" + a) } } }, getLostPoint: function (a) { for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)for (var e = 0; b > e; e++) { for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++)if (!(0 > d + h || d + h >= b)) for (var i = -1; 1 >= i; i++)0 > e + i || e + i >= b || (0 != h || 0 != i) && g == a.isDark(d + h, e + i) && f++; f > 5 && (c += 3 + f - 5) } for (var d = 0; b - 1 > d; d++)for (var e = 0; b - 1 > e; e++) { var j = 0; a.isDark(d, e) && j++, a.isDark(d + 1, e) && j++, a.isDark(d, e + 1) && j++, a.isDark(d + 1, e + 1) && j++, (0 == j || 4 == j) && (c += 3) } for (var d = 0; b > d; d++)for (var e = 0; b - 6 > e; e++)a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40); for (var e = 0; b > e; e++)for (var d = 0; b - 6 > d; d++)a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40); for (var k = 0, e = 0; b > e; e++)for (var d = 0; b > d; d++)a.isDark(d, e) && k++; var l = Math.abs(100 * k / b / b - 50) / 5; return c += 10 * l } }, g = { glog: function (a) { if (1 > a) throw new Error("glog(" + a + ")"); return g.LOG_TABLE[a] }, gexp: function (a) { for (; 0 > a;)a += 255; for (; a >= 256;)a -= 255; return g.EXP_TABLE[a] }, EXP_TABLE: new Array(256), LOG_TABLE: new Array(256) }, h = 0; 8 > h; h++)g.EXP_TABLE[h] = 1 << h; for (var h = 8; 256 > h; h++)g.EXP_TABLE[h] = g.EXP_TABLE[h - 4] ^ g.EXP_TABLE[h - 5] ^ g.EXP_TABLE[h - 6] ^ g.EXP_TABLE[h - 8]; for (var h = 0; 255 > h; h++)g.LOG_TABLE[g.EXP_TABLE[h]] = h; i.prototype = { get: function (a) { return this.num[a] }, getLength: function () { return this.num.length }, multiply: function (a) { for (var b = new Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++)for (var d = 0; d < a.getLength(); d++)b[c + d] ^= g.gexp(g.glog(this.get(c)) + g.glog(a.get(d))); return new i(b, 0) }, mod: function (a) { if (this.getLength() - a.getLength() < 0) return this; for (var b = g.glog(this.get(0)) - g.glog(a.get(0)), c = new Array(this.getLength()), d = 0; d < this.getLength(); d++)c[d] = this.get(d); for (var d = 0; d < a.getLength(); d++)c[d] ^= g.gexp(g.glog(a.get(d)) + b); return new i(c, 0).mod(a) } }, j.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]], j.getRSBlocks = function (a, b) { var c = j.getRsBlockTable(a, b); if (void 0 == c) throw new Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b); for (var d = c.length / 3, e = [], f = 0; d > f; f++)for (var g = c[3 * f + 0], h = c[3 * f + 1], i = c[3 * f + 2], k = 0; g > k; k++)e.push(new j(h, i)); return e }, j.getRsBlockTable = function (a, b) { switch (b) { case d.L: return j.RS_BLOCK_TABLE[4 * (a - 1) + 0]; case d.M: return j.RS_BLOCK_TABLE[4 * (a - 1) + 1]; case d.Q: return j.RS_BLOCK_TABLE[4 * (a - 1) + 2]; case d.H: return j.RS_BLOCK_TABLE[4 * (a - 1) + 3]; default: return void 0 } }, k.prototype = { get: function (a) { var b = Math.floor(a / 8); return 1 == (1 & this.buffer[b] >>> 7 - a % 8) }, put: function (a, b) { for (var c = 0; b > c; c++)this.putBit(1 == (1 & a >>> b - c - 1)) }, getLengthInBits: function () { return this.length }, putBit: function (a) { var b = Math.floor(this.length / 8); this.buffer.length <= b && this.buffer.push(0), a && (this.buffer[b] |= 128 >>> this.length % 8), this.length++ } }; var l = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]], o = function () { var a = function (a, b) { this._el = a, this._htOption = b }; return a.prototype.draw = function (a) { function g(a, b) { var c = document.createElementNS("http://www.w3.org/2000/svg", a); for (var d in b) b.hasOwnProperty(d) && c.setAttribute(d, b[d]); return c } var b = this._htOption, c = this._el, d = a.getModuleCount(); Math.floor(b.width / d), Math.floor(b.height / d), this.clear(); var h = g("svg", { viewBox: "0 0 " + String(d) + " " + String(d), width: "100%", height: "100%", fill: b.colorLight }); h.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), c.appendChild(h), h.appendChild(g("rect", { fill: b.colorDark, width: "1", height: "1", id: "template" })); for (var i = 0; d > i; i++)for (var j = 0; d > j; j++)if (a.isDark(i, j)) { var k = g("use", { x: String(i), y: String(j) }); k.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), h.appendChild(k) } }, a.prototype.clear = function () { for (; this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild) }, a }(), p = "svg" === document.documentElement.tagName.toLowerCase(), q = p ? o : m() ? function () { function a() { this._elImage.src = this._elCanvas.toDataURL("image/png"), this._elImage.style.display = "block", this._elCanvas.style.display = "none" } function d(a, b) { var c = this; if (c._fFail = b, c._fSuccess = a, null === c._bSupportDataURI) { var d = document.createElement("img"), e = function () { c._bSupportDataURI = !1, c._fFail && _fFail.call(c) }, f = function () { c._bSupportDataURI = !0, c._fSuccess && c._fSuccess.call(c) }; return d.onabort = e, d.onerror = e, d.onload = f, d.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", void 0 } c._bSupportDataURI === !0 && c._fSuccess ? c._fSuccess.call(c) : c._bSupportDataURI === !1 && c._fFail && c._fFail.call(c) } if (this._android && this._android <= 2.1) { var b = 1 / window.devicePixelRatio, c = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (a, d, e, f, g, h, i, j) { if ("nodeName" in a && /img/i.test(a.nodeName)) for (var l = arguments.length - 1; l >= 1; l--)arguments[l] = arguments[l] * b; else "undefined" == typeof j && (arguments[1] *= b, arguments[2] *= b, arguments[3] *= b, arguments[4] *= b); c.apply(this, arguments) } } var e = function (a, b) { this._bIsPainted = !1, this._android = n(), this._htOption = b, this._elCanvas = document.createElement("canvas"), this._elCanvas.width = b.width, this._elCanvas.height = b.height, a.appendChild(this._elCanvas), this._el = a, this._oContext = this._elCanvas.getContext("2d"), this._bIsPainted = !1, this._elImage = document.createElement("img"), this._elImage.style.display = "none", this._el.appendChild(this._elImage), this._bSupportDataURI = null }; return e.prototype.draw = function (a) { var b = this._elImage, c = this._oContext, d = this._htOption, e = a.getModuleCount(), f = d.width / e, g = d.height / e, h = Math.round(f), i = Math.round(g); b.style.display = "none", this.clear(); for (var j = 0; e > j; j++)for (var k = 0; e > k; k++) { var l = a.isDark(j, k), m = k * f, n = j * g; c.strokeStyle = l ? d.colorDark : d.colorLight, c.lineWidth = 1, c.fillStyle = l ? d.colorDark : d.colorLight, c.fillRect(m, n, f, g), c.strokeRect(Math.floor(m) + .5, Math.floor(n) + .5, h, i), c.strokeRect(Math.ceil(m) - .5, Math.ceil(n) - .5, h, i) } this._bIsPainted = !0 }, e.prototype.makeImage = function () { this._bIsPainted && d.call(this, a) }, e.prototype.isPainted = function () { return this._bIsPainted }, e.prototype.clear = function () { this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1 }, e.prototype.round = function (a) { return a ? Math.floor(1e3 * a) / 1e3 : a }, e }() : function () { var a = function (a, b) { this._el = a, this._htOption = b }; return a.prototype.draw = function (a) { for (var b = this._htOption, c = this._el, d = a.getModuleCount(), e = Math.floor(b.width / d), f = Math.floor(b.height / d), g = ['<table style="border:0;border-collapse:collapse;">'], h = 0; d > h; h++) { g.push("<tr>"); for (var i = 0; d > i; i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + e + "px;height:" + f + "px;background-color:" + (a.isDark(h, i) ? b.colorDark : b.colorLight) + ';"></td>'); g.push("</tr>") } g.push("</table>"), c.innerHTML = g.join(""); var j = c.childNodes[0], k = (b.width - j.offsetWidth) / 2, l = (b.height - j.offsetHeight) / 2; k > 0 && l > 0 && (j.style.margin = l + "px " + k + "px") }, a.prototype.clear = function () { this._el.innerHTML = "" }, a }(); QRCode = function (a, b) { if (this._htOption = { width: 256, height: 256, typeNumber: 4, colorDark: "#000000", colorLight: "#ffffff", correctLevel: d.H }, "string" == typeof b && (b = { text: b }), b) for (var c in b) this._htOption[c] = b[c]; "string" == typeof a && (a = document.getElementById(a)), this._android = n(), this._el = a, this._oQRCode = null, this._oDrawing = new q(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text) }, QRCode.prototype.makeCode = function (a) { this._oQRCode = new b(r(a, this._htOption.correctLevel), this._htOption.correctLevel), this._oQRCode.addData(a), this._oQRCode.make(), this._el.title = a, this._oDrawing.draw(this._oQRCode), this.makeImage() }, QRCode.prototype.makeImage = function () { "function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage() }, QRCode.prototype.clear = function () { this._oDrawing.clear() }, QRCode.CorrectLevel = d }();

// --- Extracted Script 3 ---
// Dynamic Greeting & Live Clock
function updateTimeAndGreeting() {
  const now = new Date();
  
  // Update Greeting
  const greetingEl = document.getElementById('greeting');
  if (greetingEl) {
    const hour = now.getHours();
    if (hour < 12) greetingEl.textContent = 'Good morning';
    else if (hour < 17) greetingEl.textContent = 'Good afternoon';
    else greetingEl.textContent = 'Good evening';
  }

  // Update Live Clock
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
}
updateTimeAndGreeting();
setInterval(updateTimeAndGreeting, 1000);

// Initialize AOS
AOS.init({
  once: true,
  offset: 50,
  duration: 800,
});

// Dark mode toggle
const dmToggle = document.getElementById('dark-toggle');
const html = document.documentElement;
const moonIcon = document.getElementById('icon-moon');
const sunIcon = document.getElementById('icon-sun');

function updateIcons(isDark) {
  if (isDark) {
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  } else {
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  }
}

dmToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  updateIcons(html.classList.contains('dark'));
});

// Mobile menu toggle
const mobBtn = document.getElementById('mob-btn');
const mobMenu = document.getElementById('mob-menu');
mobBtn.addEventListener('click', () => {
  mobMenu.classList.toggle('hidden');
});

// Typewriter effect
const phrases = ["Hardware.", "Software.", "RISC-V Cores.", "Web Apps."];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function type() {
  const currentPhrase = phrases[phraseIdx];

  if (isDeleting) {
    typewriterElement.textContent = currentPhrase.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typewriterElement.textContent = currentPhrase.substring(0, charIdx + 1);
    charIdx++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIdx === currentPhrase.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

setTimeout(type, 1000);

// Hero image reveal animation
gsap.to("#hero-photo-wrap", {
  clipPath: "inset(0 0% 0 0)",
  duration: 1.5,
  ease: "power3.inOut",
  delay: 0.5
});

// Cursor tracking
const curDot = document.getElementById('cur-dot');
const curRing = document.getElementById('cur-ring');
document.addEventListener('mousemove', (e) => {
  curDot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
  curRing.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
});

// Interactive Terminal
const termIn = document.getElementById('term-in');
const termOut = document.getElementById('term-output');

termIn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = termIn.value.trim();
    if (cmd) {
      const cmdDiv = document.createElement('div');
      const cmdSpan = document.createElement('span');
      cmdSpan.className = 'text-slate-400';
      cmdSpan.textContent = `❯ ${cmd}`;
      cmdDiv.appendChild(cmdSpan);
      termOut.appendChild(cmdDiv);
      let out = "";
      if (cmd === 'help') {
        out = 'Available commands: whoami, clear, skills, contact, connect usb, connect bt';
      } else if (cmd === 'clear') {
        termOut.innerHTML = '';
      } else if (cmd === 'whoami') {
        out = 'Suraj Tharu Chaudhary - Computer Engineer';
      } else if (cmd === 'contact') {
        out = 'Reach out at suraj.tharu@example.com';
      } else if (cmd === 'connect usb') {
        if (navigator.usb) { navigator.usb.requestDevice({ filters: [] }).catch(e => console.log(e)); out = 'Scanning for WebUSB devices...'; }
        else out = 'WebUSB not supported in this browser.';
      } else if (cmd === 'connect bt') {
        if (navigator.bluetooth) { navigator.bluetooth.requestDevice({ acceptAllDevices: true }).catch(e => console.log(e)); out = 'Scanning for Web Bluetooth devices...'; }
        else out = 'Web Bluetooth not supported in this browser.';
      } else {
        out = `Command not found: ${cmd}. Type 'help'.`;
      }
      if (out) {
        const outDiv = document.createElement('div');
        outDiv.textContent = out;
        termOut.appendChild(outDiv);
      }
      termOut.scrollTop = termOut.scrollHeight;
    }
    termIn.value = '';
  }
});

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('live-clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Progress Bar
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';
});

// --- 2. 3D Solar System Background (Three.js) ---
const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 100, 300);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffddaa, 3, 1000);
scene.add(sunLight);

const solarSystem = new THREE.Group();
scene.add(solarSystem);

// Sun
const sunGeo = new THREE.SphereGeometry(15, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const sun = new THREE.Mesh(sunGeo, sunMat);
solarSystem.add(sun);

// Planets
const planets = [];
const planetData = [
  { radius: 2, distance: 30, speed: 0.04, color: 0x888888 }, // Mercury
  { radius: 4, distance: 50, speed: 0.015, color: 0xeebb88 }, // Venus
  { radius: 4.5, distance: 75, speed: 0.01, color: 0x2266ff }, // Earth
  { radius: 3, distance: 100, speed: 0.008, color: 0xff4422 }, // Mars
  { radius: 10, distance: 150, speed: 0.002, color: 0xffaa55 }, // Jupiter
  { radius: 8, distance: 200, speed: 0.001, color: 0xddbb99 } // Saturn
];

planetData.forEach(data => {
  // Orbit path
  const orbitGeo = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 64);
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
  const orbit = new THREE.Mesh(orbitGeo, orbitMat);
  orbit.rotation.x = Math.PI / 2;
  solarSystem.add(orbit);

  // Planet
  const planetGeo = new THREE.SphereGeometry(data.radius, 16, 16);
  const planetMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.8, metalness: 0.2 });
  const planet = new THREE.Mesh(planetGeo, planetMat);

  const pivot = new THREE.Group();
  pivot.add(planet);
  planet.position.x = data.distance;
  solarSystem.add(pivot);

  planets.push({ pivot, speed: data.speed });
});

// Milky Way Galaxy
const milkyWayGeo = new THREE.BufferGeometry();
const mwStarsCount = 20000; // Increased density
const mwPosArray = new Float32Array(mwStarsCount * 3);
const mwColorArray = new Float32Array(mwStarsCount * 3);
const color1 = new THREE.Color(0x7c3aed); // Vibrant violet
const color2 = new THREE.Color(0x06b6d4); // Bright cyan
const color3 = new THREE.Color(0xf472b6); // Neon pink
const color4 = new THREE.Color(0xfacc15); // Stardust yellow

for (let i = 0; i < mwStarsCount; i++) {
  const r = 350 + Math.random() * 1100; // Wider spread
  const theta = Math.random() * Math.PI * 2;
  const spread = (Math.random() - 0.5) * (Math.random() * 500); // Thicker band

  const x = r * Math.cos(theta);
  const y = spread;
  const z = r * Math.sin(theta);

  // Tilt the Milky Way
  const tilt = Math.PI / 3;
  mwPosArray[i * 3] = x;
  mwPosArray[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
  mwPosArray[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);

  // Mix colors based on radius and random
  const rand = Math.random();
  let mixedColor;
  if (rand < 0.4) mixedColor = color1.clone().lerp(color2, Math.random());
  else if (rand < 0.7) mixedColor = color2.clone().lerp(color3, Math.random());
  else if (rand < 0.9) mixedColor = color3.clone().lerp(color1, Math.random());
  else mixedColor = color4.clone().lerp(color3, Math.random()); // Splashes of yellow/pink

  mwColorArray[i * 3] = mixedColor.r;
  mwColorArray[i * 3 + 1] = mixedColor.g;
  mwColorArray[i * 3 + 2] = mixedColor.b;
}
milkyWayGeo.setAttribute('position', new THREE.BufferAttribute(mwPosArray, 3));
milkyWayGeo.setAttribute('color', new THREE.BufferAttribute(mwColorArray, 3));
const mwMat = new THREE.PointsMaterial({ size: 2.5, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
const milkyWay = new THREE.Points(milkyWayGeo, mwMat);
scene.add(milkyWay);

// Scattered Stars
const starsGeo = new THREE.BufferGeometry();
const starsCount = 2500;
const posArray = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 2500;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMat = new THREE.PointsMaterial({ size: 1.8, color: 0xffffff, transparent: true, opacity: 0.9 });
const stars = new THREE.Points(starsGeo, starsMat);
scene.add(stars);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) - 0.5;
  mouseY = (event.clientY / window.innerHeight) - 0.5;
});

let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

const clock = new THREE.Clock();
let targetOpacity = document.documentElement.classList.contains('dark') ? 1 : 0;
let currentOpacity = targetOpacity;

// Day and Night visual configurations
const dayColor = new THREE.Color(0xf4f7f6); // Clean soft light gray/blue
const nightColor = new THREE.Color(0x050510); // Deep space
scene.background = new THREE.Color();
scene.fog = new THREE.FogExp2(0xf4f7f6, 0); // Dynamic fog to hide stars in day

function animate() {
  requestAnimationFrame(animate);
  if (!document.body.classList.contains('a11y-reduce-motion')) {
    const t = clock.getElapsedTime();

    // Rotate planets
    planets.forEach(p => {
      p.pivot.rotation.y += p.speed;
    });

    // Slightly faster dynamic rotation for Milky Way
    milkyWay.rotation.y = t * 0.0035;
    milkyWay.rotation.z = Math.sin(t * 0.05) * 0.02; // Subtle breathing tilt
    stars.rotation.y = t * 0.0015;

    // Parallax effect on camera
    camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
    camera.position.y = 100 - scrollY * 0.05; // Move down as we scroll
    camera.position.z += (300 - mouseY * 50 - camera.position.z) * 0.05;
    camera.lookAt(scene.position);

    solarSystem.rotation.x = Math.PI / 8; // slight tilt

    // Day/Night transition
    const isDark = document.documentElement.classList.contains('dark');
    targetOpacity = isDark ? 1 : 0.0;
    currentOpacity += (targetOpacity - currentOpacity) * 0.05;

    // Transition background and fog
    scene.background.lerpColors(dayColor, nightColor, currentOpacity);
    scene.fog.color.lerpColors(dayColor, nightColor, currentOpacity);
    scene.fog.density = (1 - currentOpacity) * 0.003; // Fog thickens in day mode to hide deep space

    // Transition Milky Way and stars
    mwMat.opacity = currentOpacity * 0.85;
    starsMat.opacity = currentOpacity;

    // Lighting transitions
    ambientLight.intensity = isDark ? 0.2 : 0.9;
    sunLight.intensity = isDark ? 4.0 : 1.5;
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (window.editor) {
    window.editor.layout();
  }
});

// --- 1. Service Worker for PWA ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { });
  });
}

// --- 2. Lenis Smooth Scroll ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 3. Easter Egg Console Art (Removed) ---

// --- 4. Monaco Editor Initialization ---
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
  window.editor = monaco.editor.create(document.getElementById('monaco-container'), {
    value: [
      'module riscv_core (',
      '    input wire clk,',
      '    input wire rst_n,',
      '    output wire [31:0] pc,',
      '    input wire [31:0] instr',
      ');',
      '',
      '    // Core logic goes here...',
      '    always @(posedge clk) begin',
      '        if (!rst_n) pc <= 32\'b0;',
      '        else pc <= pc + 4;',
      '    end',
      'endmodule'
    ].join('\n'),
    language: 'verilog',
    theme: document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs',
    minimap: { enabled: false },
    fontSize: 12,
    scrollBeyondLastLine: false
  });
  // Theme sync
  document.getElementById('dark-toggle').addEventListener('click', () => {
    setTimeout(() => {
      monaco.editor.setTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs');
    }, 50);
  });
});

window.runCode = function () {
  const out = document.getElementById('monaco-output');
  out.innerHTML += `<br/><span class="text-white">❯ synth_design -top riscv_core</span><br/><span class="text-yellow-400">[Warn] No constraints found.</span><br/>[Info] Synthesis complete. Logic elements: 42.`;
  out.scrollTop = out.scrollHeight;
};

// --- 5. Chart.js Radar Chart ---
const ctx = document.getElementById('radarChart').getContext('2d');
new Chart(ctx, {
  type: 'radar',
  data: {
    labels: ['Hardware Complexity', 'Software Depth', 'Innovation', 'Research', 'Performance'],
    datasets: [{
      label: 'RISC-V Softcore',
      data: [95, 80, 85, 90, 75],
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderColor: 'rgba(14, 165, 233, 1)',
      pointBackgroundColor: 'rgba(14, 165, 233, 1)',
      borderWidth: 2,
    }, {
      label: 'IoT Weather Station',
      data: [70, 95, 60, 50, 85],
      backgroundColor: 'rgba(234, 179, 8, 0.2)',
      borderColor: 'rgba(234, 179, 8, 1)',
      borderWidth: 2,
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        pointLabels: { color: '#94a3b8', font: { family: 'Space Mono', size: 10 } },
        ticks: { display: false }
      }
    },
    plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Space Mono', size: 10 } } } }
  }
});

// --- Utility: Escape HTML to prevent XSS ---
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

// --- 6. Live GitHub Feed (Mocked via API) ---
async function fetchGitHubFeed() {
  const feedDiv = document.getElementById('gh-feed');
  try {
    const res = await fetch('https://api.github.com/users/surajtharu/events/public');
    if (res.ok) {
      const events = await res.json();
      const pushes = events.filter(e => e.type === 'PushEvent').slice(0, 3);
      if (pushes.length > 0) {
        feedDiv.innerHTML = '';
        pushes.forEach(p => {
          const div = document.createElement('div');
          div.className = 'border-l-2 border-brand-500 pl-3 mt-2';

          const repoNameDiv = document.createElement('div');
          repoNameDiv.className = 'text-brand-400';
          repoNameDiv.textContent = p.repo.name;

          const msgDiv = document.createElement('div');
          msgDiv.className = 'opacity-80 truncate';
          msgDiv.textContent = p.payload.commits[0]?.message || 'Push event';

          const dateDiv = document.createElement('div');
          dateDiv.className = 'text-[10px] opacity-50';
          dateDiv.textContent = new Date(p.created_at).toLocaleString();

          div.appendChild(repoNameDiv);
          div.appendChild(msgDiv);
          div.appendChild(dateDiv);
          feedDiv.appendChild(div);
        });
      } else {
        feedDiv.innerHTML = '<div class="opacity-50">No recent pushes.</div>';
      }
    } else { throw new Error('API limit'); }
  } catch (e) {
    feedDiv.innerHTML = `
          <div class="border-l-2 border-brand-500 pl-3"><div class="text-brand-400">surajtharu/riscv-core</div><div class="opacity-80">Added pipeline flush logic</div><div class="text-[10px] opacity-50">2 hours ago</div></div>
          <div class="border-l-2 border-slate-500 pl-3 mt-2"><div class="text-brand-400">surajtharu/stm32-hal</div><div class="opacity-80">Refactored I2C driver</div><div class="text-[10px] opacity-50">1 day ago</div></div>
        `;
  }
}
fetchGitHubFeed();

// --- 7. Chat Assistant Logic ---
const chatBtn = document.getElementById('chat-btn');
const chatWidget = document.getElementById('chat-widget');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

const chatIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>';
const closeIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';

function toggleChat() {
  chatWidget.classList.toggle('open');
  if (chatWidget.classList.contains('open')) {
    chatBtn.innerHTML = closeIcon;
    chatBtn.classList.add('bg-slate-700', 'hover:bg-slate-600');
    chatBtn.classList.remove('bg-brand-500', 'hover:bg-brand-400');
    chatInput.focus();
  } else {
    chatBtn.innerHTML = chatIcon;
    chatBtn.classList.remove('bg-slate-700', 'hover:bg-slate-600');
    chatBtn.classList.add('bg-brand-500', 'hover:bg-brand-400');
  }
}

chatBtn.addEventListener('click', toggleChat);
closeChat.addEventListener('click', () => { if (chatWidget.classList.contains('open')) toggleChat(); });

// Context-Aware Logic
let currentContext = 'Hero Section';
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  let current = '';
  sections.forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 200) current = section.getAttribute('id') || current;
  });
  if (current) currentContext = current;
});

chatInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && chatInput.value.trim() !== '') {
    const msg = chatInput.value.trim();
    chatInput.value = '';
    chatInput.disabled = true;

    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'bg-brand-500 text-white p-3 rounded-xl rounded-tr-sm self-end max-w-[85%] chat-msg';
    userMsgDiv.textContent = msg;
    chatMessages.appendChild(userMsgDiv);

    // Typing indicator
    const typingId = 'typing-' + Date.now();
    chatMessages.insertAdjacentHTML('beforeend', `<div id="${typingId}" class="bg-slate-200 dark:bg-slate-800 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg dark:text-slate-400 text-slate-500 text-xs flex items-center gap-1">
          <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0s"></span>
          <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
          <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
        </div>`);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, context: currentContext })
      });
      const data = await res.json();
      document.getElementById(typingId)?.remove();

      if (data.reply) {
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'bg-slate-200 dark:bg-slate-800 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg dark:text-slate-200 text-slate-800';
        botMsgDiv.textContent = data.reply;
        chatMessages.appendChild(botMsgDiv);
        if (isVoiceMode) {
          const speech = new SpeechSynthesisUtterance(data.reply);
          window.speechSynthesis.speak(speech);
        }
      } else {
        const errorMsgDiv = document.createElement('div');
        errorMsgDiv.className = 'bg-red-500/10 text-red-500 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg text-xs';
        errorMsgDiv.textContent = data.error || 'Server error';
        chatMessages.appendChild(errorMsgDiv);
      }
    } catch (error) {
      console.error(error);
      document.getElementById(typingId)?.remove();
      const connErrorDiv = document.createElement('div');
      connErrorDiv.className = 'bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg text-xs';
      connErrorDiv.textContent = 'Error connecting to AI Server. Please ensure the backend is running.';
      chatMessages.appendChild(connErrorDiv);
    }

    chatInput.disabled = false;
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
    isVoiceMode = false;
  }
});

// Voice Input Logic
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let isVoiceMode = false;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;

  document.getElementById('voice-btn').addEventListener('click', () => {
    isVoiceMode = true;
    try {
      recognition.start();
      document.getElementById('voice-btn').classList.add('text-brand-500', 'animate-pulse');
    } catch (e) { }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    document.getElementById('voice-btn').classList.remove('text-brand-500', 'animate-pulse');
    const ke = new KeyboardEvent('keypress', { key: 'Enter' });
    chatInput.dispatchEvent(ke);
  };
  recognition.onend = () => document.getElementById('voice-btn').classList.remove('text-brand-500', 'animate-pulse');
} else {
  document.getElementById('voice-btn').style.display = 'none';
}

// --- 8. Simulated Visitor Counter ---
setInterval(() => {
  const el = document.getElementById('visit-count');
  if (el) el.textContent = parseInt(el.textContent || '42') + Math.floor(Math.random() * 2);
}, 5000);
document.getElementById('visit-count').textContent = '42';

// --- 9. Encrypted Form Simulation ---
const contactBtn = document.querySelector('a[href="mailto:suraj.tharu@example.com"]');
if (contactBtn) {
  contactBtn.addEventListener('click', (e) => {
    if (!contactBtn.classList.contains('secure-ready')) {
      e.preventDefault();
      contactBtn.classList.add('encrypting');
      contactBtn.innerHTML = 'Encrypting via PGP...';
      setTimeout(() => {
        contactBtn.classList.remove('encrypting');
        contactBtn.classList.add('secure-ready');
        contactBtn.innerHTML = 'Connection Secure ✅';
        setTimeout(() => { window.location.href = "mailto:suraj.tharu@example.com"; }, 500);
      }, 1500);
    }
  });
}

// --- 10. GSAP Hero Text Reveal ---
gsap.to(".hero-word", {
  y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)", delay: 0.2
});

// --- 11. D3 Force Directed Skills Graph ---
const width = document.getElementById('d3-skills-graph').clientWidth;
const height = 400;
const nodes = [
  { id: "Embedded", group: 1, radius: 25 },
  { id: "C/C++", group: 1, radius: 20 },
  { id: "FreeRTOS", group: 1, radius: 18 },
  { id: "FPGA", group: 2, radius: 25 },
  { id: "Verilog", group: 2, radius: 20 },
  { id: "RISC-V", group: 2, radius: 22 },
  { id: "Vivado", group: 2, radius: 15 },
  { id: "Python", group: 3, radius: 18 },
  { id: "Linux", group: 3, radius: 20 }
];
const links = [
  { source: "Embedded", target: "C/C++" },
  { source: "Embedded", target: "FreeRTOS" },
  { source: "Embedded", target: "Linux" },
  { source: "FPGA", target: "Verilog" },
  { source: "FPGA", target: "RISC-V" },
  { source: "FPGA", target: "Vivado" },
  { source: "RISC-V", target: "Verilog" },
  { source: "RISC-V", target: "C/C++" },
  { source: "Linux", target: "Python" }
];

const svg = d3.select("#d3-skills-graph").append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", [0, 0, width, height]);

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(80))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .attr("stroke", "#334155")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links).join("line")
  .attr("stroke-width", 2);

const node = svg.append("g")
  .selectAll("circle")
  .data(nodes).join("circle")
  .attr("r", d => d.radius)
  .attr("fill", d => d.group === 1 ? "#0ea5e9" : d.group === 2 ? "#eab308" : "#10b981")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .call(drag(simulation));

const labels = svg.append("g")
  .selectAll("text")
  .data(nodes).join("text")
  .text(d => d.id)
  .attr("font-size", "10px")
  .attr("font-family", "Space Mono")
  .attr("fill", document.documentElement.classList.contains('dark') ? "#f8fafc" : "#0f172a")
  .attr("dx", 12).attr("dy", 4);

simulation.on("tick", () => {
  link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
  node.attr("cx", d => Math.max(d.radius, Math.min(width - d.radius, d.x)))
    .attr("cy", d => Math.max(d.radius, Math.min(height - d.radius, d.y)));
  labels.attr("x", d => Math.max(d.radius, Math.min(width - d.radius, d.x)))
    .attr("y", d => Math.max(d.radius, Math.min(height - d.radius, d.y)));
});

function drag(simulation) {
  function dragstarted(event) { if (!event.active) simulation.alphaTarget(0.3).restart(); event.subject.fx = event.subject.x; event.subject.fy = event.subject.y; }
  function dragged(event) { event.subject.fx = event.x; event.subject.fy = event.y; }
  function dragended(event) { if (!event.active) simulation.alphaTarget(0); event.subject.fx = null; event.subject.fy = null; }
  return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
}

// --- 12. QR Code Generation ---
setTimeout(() => {
  new QRCode(document.getElementById("qr-1"), { text: "https://coursera.org/verify/example", width: 56, height: 56, colorDark: "#0f172a", colorLight: "#ffffff" });
  new QRCode(document.getElementById("qr-2"), { text: "https://aws.amazon.com/verification", width: 56, height: 56, colorDark: "#0f172a", colorLight: "#ffffff" });
}, 1000);

// --- 14. i18n Translation Logic ---
const dict = {
  'EN': { 'hi': 'Hi,', 'im': "I'm", 'playground_title': 'Engineering Playground' },
  'NP': { 'hi': 'नमस्ते,', 'im': 'म हुँ', 'playground_title': 'इन्जिनियरिङ खेल मैदान' }
};
let currentLang = 'EN';
document.getElementById('lang-toggle').addEventListener('click', (e) => {
  currentLang = currentLang === 'EN' ? 'NP' : 'EN';
  e.target.innerText = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[currentLang][key]) el.innerText = dict[currentLang][key];
  });
});

// --- 15. Global Hover Lift ---
// Apply stunning hover animations to all major section cards
document.querySelectorAll('.rounded-xl.border, .rounded-lg.border').forEach(el => {
  if (el.id !== 'chat-widget') {
    el.classList.add('hover-lift');
  }
});

// --- 16. Web Audio API Synth ---
let audioCtx;

function playSound(type) {
  if (type === 'hover' && (!audioCtx || audioCtx.state === 'suspended')) return;
  if (!audioCtx) {
    if (type !== 'click') return; // Only allow audio init on explicit clicks
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return; }
  }
  if (audioCtx.state === 'suspended') {
    const p = audioCtx.resume();
    if (p && p.catch) p.catch(() => { });
  }
  if (document.body.classList.contains('a11y-reduce-motion')) return; // Mute if accessibility mode is on

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  if (type === 'hover') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  } else if (type === 'click') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'type') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  }
}
document.querySelectorAll('a, button, .hover-lift, .magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => playSound('hover'));
  el.addEventListener('click', () => playSound('click'));
});
document.getElementById('term-in').addEventListener('keydown', () => playSound('type'));
document.getElementById('cmd-input').addEventListener('keydown', () => playSound('type'));
document.getElementById('chat-input').addEventListener('keydown', () => playSound('type'));

// --- 17. Dynamic Ambient Theming ---
function updateAmbientLight() {
  const hour = new Date().getHours();
  let color = 'transparent';
  if (hour >= 5 && hour < 8) color = 'rgba(252, 211, 77, 0.04)'; // Sunrise (Amber)
  else if (hour >= 18 && hour < 20) color = 'rgba(244, 63, 94, 0.04)'; // Sunset (Rose)
  else if (hour >= 20 || hour < 5) color = 'rgba(56, 189, 248, 0.02)'; // Night (Sky)

  let ambientOverlay = document.getElementById('ambient-light');
  if (!ambientOverlay) {
    ambientOverlay = document.createElement('div');
    ambientOverlay.id = 'ambient-light';
    ambientOverlay.className = 'fixed inset-0 pointer-events-none z-[-1] mix-blend-screen transition-colors duration-1000';
    document.body.appendChild(ambientOverlay);
  }
  ambientOverlay.style.backgroundColor = color;
}
setInterval(updateAmbientLight, 60000);
updateAmbientLight();

// --- 18. Spotlight Command Palette ---
const cmdPalette = document.getElementById('cmd-palette');
const cmdBackdrop = document.getElementById('cmd-backdrop');
const cmdInput2 = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');

const commands = [
  { title: 'Toggle Dark Mode', icon: '🌙', action: () => document.getElementById('dark-toggle').click() },
  { title: 'Navigate: About', icon: '👤', action: () => window.location.hash = '#about' },
  { title: 'Navigate: Projects', icon: '🚀', action: () => window.location.hash = '#projects' },
  { title: 'Navigate: Experience', icon: '💼', action: () => window.location.hash = '#experience' },
  { title: 'Download Resume', icon: '📄', action: () => { playSound('click'); window.open('./Suraj_Tharu_CV.pdf', '_blank'); } },
  { title: 'Open AI Assistant', icon: '🤖', action: () => toggleChat() },
  { title: 'Accessibility Settings', icon: '👁️', action: () => document.getElementById('a11y-toggle').click() }
];

function toggleCmdPalette() {
  if (cmdPalette.classList.contains('hidden')) {
    cmdPalette.classList.remove('hidden');
    cmdInput2.value = '';
    cmdInput2.focus();
    renderCmdResults('');
  } else {
    cmdPalette.classList.add('hidden');
  }
}

document.getElementById('open-cmd').addEventListener('click', toggleCmdPalette);
cmdBackdrop.addEventListener('click', toggleCmdPalette);
document.getElementById('cmd-close').addEventListener('click', toggleCmdPalette);

window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggleCmdPalette();
  }
  if (e.key === 'Escape' && !cmdPalette.classList.contains('hidden')) toggleCmdPalette();
});

cmdInput2.addEventListener('input', (e) => renderCmdResults(e.target.value));

function renderCmdResults(query) {
  const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
  cmdResults.innerHTML = filtered.map((c, i) => `
        <div class="cmd-item flex items-center gap-3 px-4 py-3 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 cursor-pointer rounded-lg text-sm dark:text-slate-300 transition-colors" data-idx="${i}">
          <span class="text-xl">${c.icon}</span>
          <span>${c.title}</span>
        </div>
      `).join('');

  document.querySelectorAll('.cmd-item').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => {
      playSound('click');
      commands[el.dataset.idx].action();
      toggleCmdPalette();
    });
  });
}

// --- 19. Accessibility Logic ---
document.getElementById('a11y-toggle').addEventListener('click', () => {
  document.getElementById('a11y-menu').classList.toggle('hidden');
});
document.getElementById('a11y-motion').addEventListener('change', (e) => document.body.classList.toggle('a11y-reduce-motion', e.target.checked));
document.getElementById('a11y-contrast').addEventListener('change', (e) => document.body.classList.toggle('a11y-high-contrast', e.target.checked));
document.getElementById('a11y-font').addEventListener('change', (e) => document.body.classList.toggle('a11y-dyslexia', e.target.checked));

// --- 20. Multiplayer Cursors (Socket.io) ---
try {
  const socket = io();
  const cursors = {};

  document.addEventListener('mousemove', (e) => {
    if (socket.connected && document.hasFocus()) {
      socket.emit('cursor-move', { x: e.pageX / window.innerWidth, y: e.pageY / window.innerHeight });
    }
  });

  socket.on('cursor-update', (data) => {
    let el = cursors[data.id];
    if (!el) {
      el = document.createElement('div');
      el.className = 'absolute w-3 h-3 rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-75 ease-out';
      el.style.backgroundColor = data.color;
      document.body.appendChild(el);
      cursors[data.id] = el;
    }
    el.style.left = (data.x * window.innerWidth) + 'px';
    el.style.top = (data.y * window.innerHeight) + 'px';
  });

  socket.on('cursor-remove', (id) => {
    if (cursors[id]) {
      cursors[id].remove();
      delete cursors[id];
    }
  });
} catch (e) { /* Socket.io not loaded silently */ }

// --- 21. Live GitHub Dashboard ---
async function fetchGitHub() {
  try {
    const res = await fetch('https://api.github.com/users/surajtharu/events/public?per_page=5');
    if (!res.ok) throw new Error('API limit');
    const events = await res.json();
    const feed = document.getElementById('gh-feed');
    if (!events || events.length === 0) {
      feed.innerHTML = '<div>No recent activity found.</div>';
      return;
    }

    feed.innerHTML = '';
    events.forEach(ev => {
      let actionText = ev.type;
      if (ev.type === 'PushEvent') actionText = `Pushed to ${ev.repo.name}`;
      else if (ev.type === 'CreateEvent') actionText = `Created ${ev.payload.ref_type} in ${ev.repo.name}`;
      else if (ev.type === 'WatchEvent') actionText = `Starred ${ev.repo.name}`;

      const div = document.createElement('div');
      div.className = 'flex gap-2 items-center';

      const arrowSpan = document.createElement('span');
      arrowSpan.className = 'text-brand-500';
      arrowSpan.textContent = '→';

      const textSpan = document.createElement('span');
      textSpan.className = 'truncate';
      textSpan.title = actionText;
      textSpan.textContent = actionText;

      div.appendChild(arrowSpan);
      div.appendChild(textSpan);
      feed.appendChild(div);
    });
  } catch (err) {
    document.getElementById('gh-feed').innerHTML = '<div class="text-red-400">Cannot load GitHub data (API Rate Limited).</div>';
  }
}
fetchGitHub();

// --- 22. GSAP ScrollTrigger Storytelling ---
try {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from("#projects .group", {
    scrollTrigger: {
      trigger: "#projects",
      start: "top 70%",
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.7)"
  });
} catch (e) { }

// --- 23. Logic Simulator ---
const inA = document.getElementById('gate-in-a');
const inB = document.getElementById('gate-in-b');
const outGate = document.getElementById('gate-out');
function updateGate() {
  if (!inA || !inB || !outGate) return;
  const res = inA.checked && inB.checked;
  outGate.innerText = res ? '1' : '0';
  outGate.className = res
    ? 'w-12 h-12 rounded-full border-4 border-green-400 bg-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.5)] flex items-center justify-center transition-all text-green-400 font-bold'
    : 'w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-600 flex items-center justify-center transition-all dark:text-white font-bold';
  if (res) playSound('click');
}
if (inA && inB) {
  inA.addEventListener('change', updateGate);
  inB.addEventListener('change', updateGate);
}

// --- 24. Contact Modal Logic ---
const initConnBtn = document.getElementById('init-conn-btn');
const contactModal = document.getElementById('contact-modal');
const closeContact = document.getElementById('close-contact');
const contactBackdrop = document.getElementById('contact-backdrop');
const contactBox = document.getElementById('contact-box');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

function openContactModal() {
  contactModal.classList.remove('hidden');
  setTimeout(() => {
    contactBox.classList.remove('scale-95', 'opacity-0');
    contactBox.classList.add('scale-100', 'opacity-100');
    document.getElementById('c-name').focus();
  }, 10);
}

function closeContactModal() {
  contactBox.classList.remove('scale-100', 'opacity-100');
  contactBox.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    contactModal.classList.add('hidden');
    contactStatus.classList.add('hidden');
    contactForm.reset();
  }, 300);
}

if (initConnBtn) initConnBtn.addEventListener('click', () => { playSound('click'); openContactModal(); });
if (closeContact) closeContact.addEventListener('click', closeContactModal);
if (contactBackdrop) contactBackdrop.addEventListener('click', closeContactModal);

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('c-name').value,
      email: document.getElementById('c-email').value,
      subject: document.getElementById('c-subject').value,
      message: document.getElementById('c-msg').value,
      honeypot: document.getElementById('c-hp').value
    };
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.innerText = 'Transmitting...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        contactStatus.innerText = 'Message transmitted successfully.';
        contactStatus.className = 'mt-4 text-center font-bold text-green-400';
        contactForm.reset();
        setTimeout(closeContactModal, 2000);
      } else {
        throw new Error('Transmission failed');
      }
    } catch (error) {
      contactStatus.innerText = 'Error: Transmission failed.';
      contactStatus.className = 'mt-4 text-center font-bold text-red-500';
    } finally {
      contactStatus.classList.remove('hidden');
      submitBtn.innerText = 'Execute Send';
      submitBtn.disabled = false;
    }
  });
}

// --- 25. Gamified Resume Mini-Game ---
const playBtn = document.getElementById('play-resume');
const gameModal = document.getElementById('game-modal');
const gameCanvas = document.getElementById('game-canvas');
const gameOverlay = document.getElementById('game-overlay');
const startGameBtn = document.getElementById('start-game-btn');
const closeGame = document.getElementById('close-game');
const scoreEl = document.getElementById('game-score');
let gameCtx, gameLoopId, gameScore = 0;
let player, fallingItems = [];
const skillsList = ['GIS', 'QGIS', 'Python', 'GEE', 'React', 'Linux'];

if (playBtn && gameCanvas) {
  gameCtx = gameCanvas.getContext('2d');
  playBtn.addEventListener('click', () => {
    playSound('click');
    gameModal.classList.remove('hidden');
    gameOverlay.classList.remove('hidden');
  });

  closeGame.addEventListener('click', () => {
    gameModal.classList.add('hidden');
    cancelAnimationFrame(gameLoopId);
  });

  startGameBtn.addEventListener('click', () => {
    gameOverlay.classList.add('hidden');
    resetGame();
    gameLoopId = requestAnimationFrame(gameLoop);
  });

  const keys = {};
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  function resetGame() {
    gameScore = 0;
    scoreEl.innerText = gameScore;
    player = { x: 275, y: 350, w: 50, h: 20, speed: 6 };
    fallingItems = [];
  }

  function gameLoop() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Move player
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < gameCanvas.width - player.w) player.x += player.speed;

    // Draw player
    gameCtx.fillStyle = '#0ea5e9';
    gameCtx.fillRect(player.x, player.y, player.w, player.h);

    // Spawn items
    if (Math.random() < 0.02) {
      fallingItems.push({
        x: Math.random() * (gameCanvas.width - 40),
        y: 0,
        text: skillsList[Math.floor(Math.random() * skillsList.length)],
        speed: 2 + Math.random() * 2
      });
    }

    // Update items
    for (let i = fallingItems.length - 1; i >= 0; i--) {
      let item = fallingItems[i];
      item.y += item.speed;

      gameCtx.fillStyle = '#38bdf8';
      gameCtx.font = '14px monospace';
      gameCtx.fillText(item.text, item.x, item.y);

      // Collision
      if (item.y > player.y && item.y < player.y + player.h && item.x > player.x - 30 && item.x < player.x + player.w) {
        gameScore += 10;
        scoreEl.innerText = gameScore;
        playSound('click');
        fallingItems.splice(i, 1);
        continue;
      }

      if (item.y > gameCanvas.height) {
        fallingItems.splice(i, 1);
      }
    }

    gameLoopId = requestAnimationFrame(gameLoop);
  }
}