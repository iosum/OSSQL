import { wrapTableColumnsWithBrackets } from "../src/functions";
describe("wrapTableColumnsWithBrackets", () => {
  it("將 table 加上大括弧", () => {
    const sql = "SELECT name, age FROM users WHERE id = 1";
    const tableColumns = ["users"];
    const expected = "SELECT name, age FROM {users} WHERE id = 1";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("移除table外圍的中括弧，並加上大括弧", () => {
    const sql = "SELECT name, age FROM [users]";
    const tableColumns = ["users"];
    const expected = "SELECT name, age FROM {users}";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("偵測到 INNER JOIN 的 TABLE，並加上大括弧", () => {
    const sql =
      "SELECT name, age FROM Table1 INNER JOIN Table2 ON Table2.Id = Table1.Id";
    const tableColumns = ["Table1", "Table2"];
    const expected =
      "SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("偵測到 INNER JOIN 的 TABLE，且移除FROM [Table1]的中括弧，並加上大括弧", () => {
    const sql =
      "SELECT name, age FROM [Table1] INNER JOIN Table2 ON Table2.Id = Table1.Id";
    const tableColumns = ["Table1", "Table2"];
    const expected =
      "SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("偵測到 INNER JOIN 的 TABLE，且移除 INNER JOIN [Table2]的中括弧，並加上大括弧", () => {
    const sql =
      "SELECT name, age FROM Table1 INNER JOIN [Table2] ON Table2.Id = Table1.Id";
    const tableColumns = ["Table1", "Table2"];
    const expected =
      "SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("偵測到 INNER JOIN 的 TABLE，且移除ON [Table2].Id的中括弧，並加上大括弧", () => {
    const sql =
      "SELECT name, age FROM Table1 INNER JOIN Table2 ON [Table2].Id = Table1.Id";
    const tableColumns = ["Table1", "Table2"];
    const expected =
      "SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("偵測到 INNER JOIN 的 TABLE，且移除FROM [Table1] ，ON [Table2].Id的中括弧，並加上大括弧", () => {
    const sql =
      "SELECT name, age FROM [Table1] INNER JOIN Table2 ON [Table2].Id = Table1.Id";
    const tableColumns = ["Table1", "Table2"];
    const expected =
      "SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("偵測到 INNER JOIN 的 TABLE，且移除FROM [Table1] ，INNER JOIN [Table2]，ON [Table2].Id = [Table1].Id的中括弧，並加上大括弧", () => {
    const sql =
      "SELECT name, age FROM [Table1] INNER JOIN [Table2] ON [Table2].Id = [Table1].Id";
    const tableColumns = ["Table1", "Table2"];
    const expected =
      "SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("若有一個table name 包含另一table 的名字，則須match exact word only", () => {
    const sql =
      "SELECT name, age FROM [Table1] INNER JOIN [Table12] ON [Table12].Id = [Table1].Id";
    const tableColumns = ["Table1", "Table12"];
    const expected =
      "SELECT name, age FROM {Table1} INNER JOIN {Table12} ON {Table12}.Id = {Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });

  it("若有一個table name 包含另一table 的名字，則須match exact word only", () => {
    const sql =
      "SELECT name, age FROM [#Table1] INNER JOIN [Table12] ON [Table12].Id = [#Table1].Id";
    const tableColumns = ["#Table1", "Table12"];
    const expected =
      "SELECT name, age FROM {#Table1} INNER JOIN {Table12} ON {Table12}.Id = {#Table1}.Id";
    const result = wrapTableColumnsWithBrackets(sql, tableColumns);
    expect(result).toEqual(expected);
  });
});
