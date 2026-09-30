import { describe, expect, it } from "vitest";
import {
  baseValue,
  buyRoom,
  cashOutValue,
  price,
  quoteBuyByShares,
  quoteBuyBySpend,
  quoteSell,
  sharesForPremium,
} from "./market";

// Numbers below are the PRD's Section 6 worked example.
describe("worked example: opening act vs superstar", () => {
  const q0 = 2_500; // 10.5% starting premium

  it("prices the opening act", () => {
    const bThen = baseValue(50_000);
    expect(bThen).toBeCloseTo(2.236, 3);
    expect(price(bThen, q0)).toBeCloseTo(2.471, 3);

    const buy = quoteBuyBySpend(bThen, q0, 2_000);
    expect(buy.fee).toBeCloseTo(20, 6);
    expect(buy.shares).toBeCloseTo(788.66, 1);
    expect(buy.impact).toBeCloseTo(0.032, 3);

    const bNow = baseValue(800_000);
    expect(bNow).toBeCloseTo(8.944, 3);
    const value = cashOutValue(bNow, q0 + buy.shares, buy.shares);
    expect(value).toBeCloseTo(7_840.7, 0);
    expect(value / 2_000 - 1).toBeCloseTo(2.92, 2);
  });

  it("prices the superstar", () => {
    const bThen = baseValue(80_000_000);
    expect(price(bThen, q0)).toBeCloseTo(98.85, 2);

    const buy = quoteBuyBySpend(bThen, q0, 2_000);
    expect(buy.shares).toBeCloseTo(20.02, 2);

    const value = cashOutValue(baseValue(88_000_000), q0 + buy.shares, buy.shares);
    expect(value).toBeCloseTo(2_055.9, 0);
  });
});

describe("curve properties", () => {
  it("a round trip with no stat change returns 98.01% of the spend", () => {
    for (const spend of [10, 500, 9_000]) {
      const b = baseValue(300_000);
      const buy = quoteBuyBySpend(b, 1_000, spend);
      const sell = quoteSell(b, 1_000 + buy.shares, buy.shares);
      expect(sell.cash / spend).toBeCloseTo(0.9801, 10);
    }
  });

  it("buying by shares and by spend agree", () => {
    const b = baseValue(1_200_000);
    const bySpend = quoteBuyBySpend(b, 4_000, 3_000);
    const byShares = quoteBuyByShares(b, 4_000, bySpend.shares);
    expect(byShares.cash).toBeCloseTo(3_000, 6);
  });

  it("maps premiums to starting shares", () => {
    expect(sharesForPremium(0)).toBe(0);
    expect(price(1, sharesForPremium(0.4))).toBeCloseTo(1.4, 10);
  });

  it("1,250 shares moves any artist about 5%", () => {
    for (const listeners of [60_000, 5_000_000, 90_000_000]) {
      const q = quoteBuyByShares(baseValue(listeners), 0, 1_250);
      expect(q.impact).toBeCloseTo(0.0513, 4);
    }
  });
});

describe("buy room", () => {
  const b = baseValue(100_000);

  it("the buy limit binds for a cheap artist with plenty of cash", () => {
    const room = buyRoom(b, 2_000, 0, 0, 10_000);
    expect(room.max).toBe(1_250);
    expect(room.reason).toBe("limit");
  });

  it("shares already bought reduce the room, and selling does not restore it", () => {
    expect(buyRoom(b, 2_000, 0, 1_000, 10_000).max).toBe(250);
    expect(buyRoom(b, 2_000, 0, 1_250, 10_000).max).toBe(0);
  });

  it("the stake cap floor binds when the player already holds a lot", () => {
    const room = buyRoom(b, 5_000, 2_000, 0, 1e9);
    expect(room.max).toBe(500);
    expect(room.reason).toBe("stake");
  });

  it("cash binds for an expensive artist", () => {
    const room = buyRoom(baseValue(90_000_000), 2_000, 0, 0, 10_000);
    expect(room.reason).toBe("cash");
    expect(quoteBuyByShares(baseValue(90_000_000), 2_000, room.max).cash).toBeCloseTo(10_000, 4);
  });
});
