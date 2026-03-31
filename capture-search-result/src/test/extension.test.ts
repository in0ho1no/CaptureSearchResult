import * as assert from 'assert';
import { processSearchResultsLineByLine, getSummaries, processSearchResults } from '../extension';

const SEP = '♪';

suite('processSearchResultsLineByLine', () => {

	test('空の入力は空配列を返す', () => {
		assert.deepStrictEqual(processSearchResultsLineByLine([], SEP), []);
	});

	test('空白行のみは空配列を返す', () => {
		assert.deepStrictEqual(processSearchResultsLineByLine(['', '   ', '\t'], SEP), []);
	});

	test('単一ファイル・単一結果を正しく加工する', () => {
		const input = [
			'/path/to/file.ts',
			'  10:    some code here',
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0], `1${SEP}/path/to/file.ts${SEP}10${SEP}some code here`);
	});

	test('単一ファイル・複数結果を正しく加工する', () => {
		const input = [
			'/path/to/file.ts',
			'  10:    first match',
			'  25:    second match',
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 2);
		assert.strictEqual(result[0], `1${SEP}/path/to/file.ts${SEP}10${SEP}first match`);
		assert.strictEqual(result[1], `2${SEP}/path/to/file.ts${SEP}25${SEP}second match`);
	});

	test('複数ファイルの結果を正しく加工する', () => {
		const input = [
			'/path/to/file1.ts',
			'  10:    match in file1',
			'/path/to/file2.ts',
			'  5:    match in file2',
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 2);
		assert.strictEqual(result[0], `1${SEP}/path/to/file1.ts${SEP}10${SEP}match in file1`);
		assert.strictEqual(result[1], `2${SEP}/path/to/file2.ts${SEP}5${SEP}match in file2`);
	});

	test('連番(No.)が複数ファイルをまたいで連続する', () => {
		const input = [
			'/file1.ts',
			'  1:    aaa',
			'  2:    bbb',
			'/file2.ts',
			'  3:    ccc',
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 3);
		assert.ok(result[0].startsWith(`1${SEP}`));
		assert.ok(result[1].startsWith(`2${SEP}`));
		assert.ok(result[2].startsWith(`3${SEP}`));
	});

	test('行番号のコロンがない行は無視される', () => {
		const input = [
			'/path/to/file.ts',
			'  notAMatch',
			'  10:    valid match',
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 1);
		assert.ok(result[0].includes(`${SEP}10${SEP}`));
	});

	test('検索結果内の区切り文字はそのまま保持される', () => {
		const input = [
			'/file.ts',
			`  10:    text${SEP}with${SEP}separator`,
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 1);
		assert.ok(result[0].endsWith(`text${SEP}with${SEP}separator`));
	});

	test('ファイル名末尾のコロンが除去される', () => {
		const input = [
			'/path/to/file.ts:',
			'  10:    match',
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].split(SEP)[1], '/path/to/file.ts');
	});

	test('検索結果が空文字の行も1件として加工される', () => {
		const input = [
			'/file.ts',
			'  10:    ',
		];
		const result = processSearchResultsLineByLine(input, SEP);
		assert.strictEqual(result.length, 1);
		assert.ok(result[0].endsWith(`${SEP}10${SEP}`));
	});
});

suite('getSummaries', () => {

	test('正しい形式のサマリ行を返す', () => {
		assert.deepStrictEqual(
			getSummaries(['5 件の結果 - 2 ファイル']),
			['5 件の結果 - 2 ファイル']
		);
	});

	test('サマリ以外の行はフィルタされる', () => {
		const input = [
			'5 件の結果 - 2 ファイル',
			'/path/to/file.ts',
			'  10:    match',
		];
		assert.deepStrictEqual(getSummaries(input), ['5 件の結果 - 2 ファイル']);
	});

	test('空の配列は空配列を返す', () => {
		assert.deepStrictEqual(getSummaries([]), []);
	});

	test('サマリがない場合は空配列を返す', () => {
		const input = ['/path/to/file.ts', '  10:    match'];
		assert.deepStrictEqual(getSummaries(input), []);
	});

	test('0件・0ファイルのサマリも認識する', () => {
		assert.deepStrictEqual(
			getSummaries(['0 件の結果 - 0 ファイル']),
			['0 件の結果 - 0 ファイル']
		);
	});

	test('"ファイル"でなく"files"の場合は無視される', () => {
		assert.deepStrictEqual(getSummaries(['5 件の結果 - 2 files']), []);
	});

	test('複数のサマリ行が存在する場合は全て返す', () => {
		const input = [
			'5 件の結果 - 2 ファイル',
			'3 件の結果 - 1 ファイル',
		];
		assert.deepStrictEqual(getSummaries(input), [
			'5 件の結果 - 2 ファイル',
			'3 件の結果 - 1 ファイル',
		]);
	});
});

suite('processSearchResults（統合テスト、デフォルト設定を使用）', () => {

	// デフォルト設定: copy-summary=true, add-columnTitleRow=true
	// 出力 = サマリ(1) + タイトル行(1) + 検索結果行(n)

	const typicalInput = [
		'5 件の結果 - 2 ファイル',
		'',
		'/path/to/file1.ts',
		'  10:    first match',
		'  25:    second match',
		'',
		'/path/to/file2.ts',
		'  5:    third match',
	].join('\n');

	test('検索結果が存在する場合、空配列にならない', () => {
		const result = processSearchResults(typicalInput, SEP);
		assert.ok(result.length > 0);
	});

	test('サマリ・タイトル行・検索結果3件の計5行を返す', () => {
		const result = processSearchResults(typicalInput, SEP);
		assert.strictEqual(result.length, 5);
	});

	test('先頭行にサマリが含まれる', () => {
		const result = processSearchResults(typicalInput, SEP);
		assert.strictEqual(result[0], '5 件の結果 - 2 ファイル');
	});

	test('2行目にタイトル行が含まれる', () => {
		const result = processSearchResults(typicalInput, SEP);
		assert.strictEqual(result[1], `No.${SEP}ファイル名${SEP}行数${SEP}検索結果`);
	});

	test('空文字列の入力は空配列を返す', () => {
		const result = processSearchResults('', SEP);
		assert.deepStrictEqual(result, []);
	});

	test('ファイル名のみで検索結果がない場合は空配列を返す', () => {
		const result = processSearchResults('/path/to/file.ts\n', SEP);
		assert.deepStrictEqual(result, []);
	});

	test('カスタム区切り文字が全行に反映される', () => {
		const customSep = '|';
		const input = '/file.ts\n  1:    match\n';
		const result = processSearchResults(input, customSep);
		// 検索結果行に区切り文字が含まれる
		const resultRow = result.find((r: string) => r.startsWith('1' + customSep));
		assert.ok(resultRow !== undefined);
	});
});
