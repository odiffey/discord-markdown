import { expect, test } from 'vitest';
import { toHTML } from '../src/main';

test('Converts **text** to <strong>text</strong>', () => {
    expect(toHTML('This is a **test** with **some bold** text in it')).toBe(
        'This is a <strong>test</strong> with <strong>some bold</strong> text in it',
    );
});

test('Converts _text_ to <em>text</em>', () => {
    expect(toHTML('This is a _test_ with _some italicized_ text in it')).toBe(
        'This is a <em>test</em> with <em>some italicized</em> text in it',
    );
});

test('Converts _ text_ to <em> text </em>', () => {
    expect(toHTML('This is a _ test_ with _ italic _ text in it')).toBe(
        'This is a <em> test</em> with <em> italic </em> text in it',
    );
});

test('Converts __text__ to <u>text</u>', () => {
    expect(
        toHTML('This is a __test__ with __some underlined__ text in it'),
    ).toBe('This is a <u>test</u> with <u>some underlined</u> text in it');
});

test('Converts *text* to <em>text</em>', () => {
    expect(toHTML('This is a *test* with *some italicized* text in it')).toBe(
        'This is a <em>test</em> with <em>some italicized</em> text in it',
    );
});

test('Converts `text` to <code>text</code>', () => {
    expect(toHTML('Code: `1 + 1 = 2`')).toBe('Code: <code>1 + 1 = 2</code>');
});

test('Converts ~~text~~ to <del>text</del>', () => {
    expect(toHTML('~~this~~that')).toBe('<del>this</del>that');
});

test('Converts ~~ text ~~ to <del>', () => {
    expect(toHTML('~~ text ~~ stuffs')).toBe('<del> text </del> stuffs');
});

test('Converts links to <a> links', () => {
    expect(toHTML('https://brussell.me')).toBe(
        '<a href="https://brussell.me">https://brussell.me</a>',
    );

    expect(toHTML('<https://brussell.me>')).toBe(
        '<a href="https://brussell.me">https://brussell.me</a>',
    );
});

test('Fence normal code blocks', () => {
    expect(toHTML('text\n```\ncode\nblock\n```\nmore text')).toBe(
        'text<br><pre><code class="hljs">code\nblock</code></pre><br>more text',
    );
});

test('Fenced code blocks with hljs', () => {
    expect(toHTML('```js\nconst one = 1;\nconsole.log(one);\n```')).toBe(
        '<pre><code class="hljs js"><span class="hljs-keyword">const</span> one = <span class="hljs-number">1</span>;\n<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(one);</code></pre>',
    );
});

test('Fenced code blocks on one line', () => {
    expect(toHTML('`test`\n\n```test```')).toBe(
        '<code>test</code><br><br><pre><code class="hljs">test</code></pre>',
    );
});

test('Escaped marks', () => {
    expect(toHTML('Code: \\`1 + 1` = 2`')).toBe('Code: `1 + 1<code>= 2</code>');
});

test('Multiline', () => {
    expect(toHTML('multi\nline')).toBe('multi<br>line');
    expect(toHTML('some *awesome* text\nthat **spreads** lines')).toBe(
        'some <em>awesome</em> text<br>that <strong>spreads</strong> lines',
    );
});

test('Block quotes', () => {
    expect(toHTML('> text > here')).toBe(
        '<blockquote>text &gt; here</blockquote>',
    );
    expect(toHTML('> text\nhere')).toBe(
        '<blockquote>text<br></blockquote>here',
    );
    expect(toHTML('>text')).toBe('&gt;text');
    expect(toHTML('outside\n>>> inside\ntext\n> here\ndoes not end')).toBe(
        'outside<br><blockquote>inside<br>text<br>&gt; here<br>does not end</blockquote>',
    );
    expect(toHTML('>>> test\n```js\ncode```')).toBe(
        '<blockquote>test<br><pre><code class="hljs js">code</code></pre></blockquote>',
    );
    expect(toHTML('> text\n> \n> here')).toBe(
        '<blockquote>text<br><br>here</blockquote>',
    );
    expect(
        toHTML(
            'text\n\n> Lorem ipsum\n>> Lorem ipsum\n> Lorem ipsum\n> > Lorem ipsum\n> Lorem ipsum\n\nLorem ipsum\n\n> Lorem ipsum\n\nLorem ipsum\n\n>>> text\ntext\ntext\n',
        ),
    ).toBe(
        'text<br><br><blockquote>Lorem ipsum<br></blockquote>&gt;&gt; Lorem ipsum<br><blockquote>Lorem ipsum<br>&gt; Lorem ipsum<br>Lorem ipsum<br></blockquote><br>Lorem ipsum<br><br><blockquote>Lorem ipsum<br></blockquote><br>Lorem ipsum<br><br><blockquote>text<br>text<br>text<br></blockquote>',
    );
});

test("don't drop arms", () => {
    expect(toHTML('¯\\_(ツ)_/¯')).toBe('¯\\_(ツ)_/¯');
    expect(toHTML('¯\\_(ツ)_/¯ *test* ¯\\_(ツ)_/¯')).toBe(
        '¯\\_(ツ)_/¯ <em>test</em> ¯\\_(ツ)_/¯',
    );
});

test('escape html', () => {
    expect(toHTML('<b>test</b>')).toBe('&lt;b&gt;test&lt;/b&gt;');
    expect(toHTML('```\n\n<b>test</b>\n```')).toBe(
        '<pre><code class="hljs">&lt;b&gt;test&lt;/b&gt;</code></pre>',
    );
    expect(toHTML('```html\n\n<b>test</b>\n```')).toBe(
        '<pre><code class="hljs html"><span class="hljs-tag">&lt;<span class="hljs-name">b</span>&gt;</span>test<span class="hljs-tag">&lt;/<span class="hljs-name">b</span>&gt;</span></code></pre>',
    );
});

test("don't escape html if set", () => {
    expect(toHTML('<b>test</b>', { escapeHTML: false })).toBe('<b>test</b>');
});

test('css module support', () => {
    expect(
        toHTML('Hey @everyone check this out!', {
            cssModuleNames: {
                'd-mention': '_DiscordMessage_1ve6S_d-mention_A64y',
                'd-user': '_DiscordMessage_1ve6S_d-user_75Tef',
            },
        }),
    ).toBe(
        'Hey <span class="_DiscordMessage_1ve6S_d-mention_A64y _DiscordMessage_1ve6S_d-user_75Tef">@everyone</span> check this out!',
    );

    expect(toHTML('Hey @everyone check this out!')).toBe(
        'Hey <span class="d-mention d-user">@everyone</span> check this out!',
    );
});

test('limited heading parsing', () => {
    expect(toHTML('# Heading one')).toBe('<h1>Heading one</h1>');
    expect(toHTML('## Heading two')).toBe('<h2>Heading two</h2>');
    expect(toHTML('### Heading three')).toBe('<h3>Heading three</h3>');
    expect(toHTML('#### Heading four')).toBe('#### Heading four');
    expect(toHTML('##### Heading five')).toBe('##### Heading five');
    expect(toHTML('###### Heading six')).toBe('###### Heading six');
});

test('heading following another', () => {
    expect(toHTML('# Heading One\n# Heading Two')).toBe(
        '<h1>Heading One</h1><h1>Heading Two</h1>',
    );
});

test('heading following list', () => {
    expect(toHTML('- List\n\n# Heading')).toBe(
        '<ul><li>List</li></ul><h1>Heading</h1>',
    );
});

test('lists parsing', () => {
    expect(toHTML('- Line One')).toBe('<ul><li>Line One</li></ul>');
    expect(toHTML('- Line One\n- Line Two')).toBe(
        '<ul><li>Line One</li><li>Line Two</li></ul>',
    );
});

test('nested lists', () => {
    expect(toHTML('- Item\n  - Child\n  - Child\n- Item')).toBe(
        '<ul><li>Item<br><ul><li>Child</li><li>Child</li></ul></li><li>Item</li></ul>',
    );
});

test('footnote', () => {
    expect(toHTML('-# Footnote')).toBe('<small>Footnote</small>');
});
