import {
    wrapTableColumnsWithBrackets,
    removeDboPrefixForTableColumns,
} from '../src/functions';

describe('wrapTableColumnsWithBrackets', () => {
    it('將 table 加上大括弧', () => {
        const sql = 'SELECT name, age FROM users WHERE id = 1';
        const tableColumns = ['users'];
        const expected = 'SELECT name, age FROM {users} WHERE id = 1';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('移除table外圍的中括弧，並加上大括弧', () => {
        const sql = 'SELECT name, age FROM [users]';
        const tableColumns = ['users'];
        const expected = 'SELECT name, age FROM {users}';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('偵測到 INNER JOIN 的 TABLE，並加上大括弧', () => {
        const sql =
            'SELECT name, age FROM Table1 INNER JOIN Table2 ON Table2.Id = Table1.Id';
        const tableColumns = ['Table1', 'Table2'];
        const expected =
            'SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('偵測到 INNER JOIN 的 TABLE，且移除FROM [Table1]的中括弧，並加上大括弧', () => {
        const sql =
            'SELECT name, age FROM [Table1] INNER JOIN Table2 ON Table2.Id = Table1.Id';
        const tableColumns = ['Table1', 'Table2'];
        const expected =
            'SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('偵測到 INNER JOIN 的 TABLE，且移除 INNER JOIN [Table2]的中括弧，並加上大括弧', () => {
        const sql =
            'SELECT name, age FROM Table1 INNER JOIN [Table2] ON Table2.Id = Table1.Id';
        const tableColumns = ['Table1', 'Table2'];
        const expected =
            'SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('偵測到 INNER JOIN 的 TABLE，且移除ON [Table2].Id的中括弧，並加上大括弧', () => {
        const sql =
            'SELECT name, age FROM Table1 INNER JOIN Table2 ON [Table2].Id = Table1.Id';
        const tableColumns = ['Table1', 'Table2'];
        const expected =
            'SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('偵測到 INNER JOIN 的 TABLE，且移除FROM [Table1] ，ON [Table2].Id的中括弧，並加上大括弧', () => {
        const sql =
            'SELECT name, age FROM [Table1] INNER JOIN Table2 ON [Table2].Id = Table1.Id';
        const tableColumns = ['Table1', 'Table2'];
        const expected =
            'SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('偵測到 INNER JOIN 的 TABLE，且移除FROM [Table1] ，INNER JOIN [Table2]，ON [Table2].Id = [Table1].Id的中括弧，並加上大括弧', () => {
        const sql =
            'SELECT name, age FROM [Table1] INNER JOIN [Table2] ON [Table2].Id = [Table1].Id';
        const tableColumns = ['Table1', 'Table2'];
        const expected =
            'SELECT name, age FROM {Table1} INNER JOIN {Table2} ON {Table2}.Id = {Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('若有一個table name 包含另一table 的名字，則須match exact word only', () => {
        const sql =
            'SELECT name, age FROM [Table1] INNER JOIN [Table12] ON [Table12].Id = [Table1].Id';
        const tableColumns = ['Table1', 'Table12'];
        const expected =
            'SELECT name, age FROM {Table1} INNER JOIN {Table12} ON {Table12}.Id = {Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('若有一個table name 包含另一table 的名字，則須match exact word only', () => {
        const sql =
            'SELECT name, age FROM [#Table1] INNER JOIN [Table12] ON [Table12].Id = [#Table1].Id';
        const tableColumns = ['#Table1', 'Table12'];
        const expected =
            'SELECT name, age FROM {#Table1} INNER JOIN {Table12} ON {Table12}.Id = {#Table1}.Id';
        const result = wrapTableColumnsWithBrackets(sql, tableColumns);
        expect(result).toEqual(expected);
    });
});

describe('removeDboAndBracketsFromColumns', () => {
    it('從 dbo.table 變成 table', () => {
        const sql = 'SELECT name, age FROM dbo.users WHERE dbo.users.id = 1';
        const tableColumns = ['users'];
        const expected = 'SELECT name, age FROM users WHERE users.id = 1';
        const result = removeDboPrefixForTableColumns(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('從 [dbo].users 變成 table', () => {
        const sql = 'SELECT name, age FROM [dbo].users WHERE id = 1';
        const tableColumns = ['users'];
        const expected = 'SELECT name, age FROM users WHERE id = 1';
        const result = removeDboPrefixForTableColumns(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('從 dbo.[table] 變成 [table]', () => {
        const sql =
            'SELECT name, age FROM dbo.[users] WHERE dbo.[users].id = 1';
        const tableColumns = ['users'];
        const expected = 'SELECT name, age FROM [users] WHERE [users].id = 1';
        const result = removeDboPrefixForTableColumns(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('移除 [dbo].[table] 變成 [table]', () => {
        const sql =
            'SELECT name, age FROM [dbo].[users] WHERE [dbo].[users].id = 1';
        const tableColumns = ['users'];
        const expected = 'SELECT name, age FROM [users] WHERE [users].id = 1';
        const result = removeDboPrefixForTableColumns(sql, tableColumns);
        expect(result).toEqual(expected);
    });
});

describe('formatSql', () => {
    it('Test View. Remove [] with {}', () => {
        const sql = `SELECT D.Column1, D.Column2, D.Column3, D.Column4
    FROM (
        SELECT ROW_NUMBER() OVER ( ORDER BY InnerQuery.Column2 ) AS RowNo, 
      InnerQuery.Column1, InnerQuery.Column2, InnerQuery.Column3, InnerQuery.Column4
        FROM
        (
            SELECT Data.Column1, Data.Column2, Data.Column3, Data.Column4
            FROM
            (
                SELECT DISTINCT [Table1].[Column1], 
          [Table1].Column2, 
          [Table1].Column3, 
          [Table1].Column4,
                FROM [Table1] 
          WHERE [Table1].Column5 = @Id5 
          AND [Table1].[Column6] = 1
            ) Data
            WHERE Exists(
                SELECT [view1].Column1
                FROM [view1]
                where [view1].Column1 = Data.Column1
            )
            AND @IsTest = 1 
        AND ( @Keyword = ''
                OR Data.[Column4] LIKE '%'+@Keyword+'%'
                OR Data.[Column2] LIKE '%'+@Keyword+'%'
                OR Data.[Column3] LIKE '%'+@Keyword+'%'
        )
            AND Data.Column1 not in ( @ExcludeIds )
        ) InnerQuery
    ) D
    WHERE D.RowNo BETWEEN @StartRow AND @EndRow`;
        const tableColumns = ['view1', 'Table1'];
        const expected = `SELECT D.Column1, D.Column2, D.Column3, D.Column4
    FROM (
        SELECT ROW_NUMBER() OVER ( ORDER BY InnerQuery.Column2 ) AS RowNo, 
      InnerQuery.Column1, InnerQuery.Column2, InnerQuery.Column3, InnerQuery.Column4
        FROM
        (
            SELECT Data.Column1, Data.Column2, Data.Column3, Data.Column4
            FROM
            (
                SELECT DISTINCT {Table1}.[Column1], 
          {Table1}.Column2, 
          {Table1}.Column3, 
          {Table1}.Column4,
                FROM {Table1} 
          WHERE {Table1}.Column5 = @Id5 
          AND {Table1}.[Column6] = 1
            ) Data
            WHERE Exists(
                SELECT {view1}.Column1
                FROM {view1}
                where {view1}.Column1 = Data.Column1
            )
            AND @IsTest = 1 
        AND ( @Keyword = ''
                OR Data.[Column4] LIKE '%'+@Keyword+'%'
                OR Data.[Column2] LIKE '%'+@Keyword+'%'
                OR Data.[Column3] LIKE '%'+@Keyword+'%'
        )
            AND Data.Column1 not in ( @ExcludeIds )
        ) InnerQuery
    ) D
    WHERE D.RowNo BETWEEN @StartRow AND @EndRow`;
        const result = wrapTableColumnsWithBrackets(
            removeDboPrefixForTableColumns(sql, tableColumns),
            tableColumns
        );
        expect(result).toEqual(expected);
    });

    it('Test Function. Not removing any []', () => {
        const sql = 'EXEC [dbo].[FN_1]';
        const tableColumns = [];
        const expected = 'EXEC [dbo].[FN_1]';
        const result = wrapTableColumnsWithBrackets(
            removeDboPrefixForTableColumns(sql, tableColumns),
            tableColumns
        );
        expect(result).toEqual(expected);
    });

    it("Test Function. Not removing any []. With tableColumns = [' ']", () => {
        const sql = 'EXEC [dbo].[FN_1]';
        const tableColumns = [' '];
        const expected = 'EXEC [dbo].[FN_1]';
        const result = removeDboPrefixForTableColumns(sql, tableColumns);
        expect(result).toEqual(expected);
    });

    it('Test stored procedure. Not removing any []', () => {
        const sql = `USE AdventureWorks2019;  
      GO  
      EXEC dbo.uspGetEmployeeManagers @BusinessEntityID = 50;
      GO`;
        const tableColumns = [];
        const expected = `USE AdventureWorks2019;  
      GO  
      EXEC dbo.uspGetEmployeeManagers @BusinessEntityID = 50;
      GO`;
        const result = wrapTableColumnsWithBrackets(
            removeDboPrefixForTableColumns(sql, tableColumns),
            tableColumns
        );
        expect(result).toEqual(expected);
    });
});
