/*
 * Commonly used regular expressions.
 */

const captureHtmlTagAttrs = '(?: ((?:(?:\\S| )+?)))?';

module.exports = {
    /*
     * let str = '    <myTag implicit-attr explicit-attr="value">Contents</myTag>';
     *
     * str.replace(regexpFactory.tag('myTag'), function($0, $1, $2) {
     *     console.log($0); // '<myTag implicit-attr explicit-attr="value">Contents</myTag>'
     *     console.log($1); // 'implicit-attr explicit-attr="value"'
     *     console.log($2); // 'Contents'
     * });
     */
    tag: function(tagName) {
        return new RegExp('<' + tagName + captureHtmlTagAttrs + '>((?:.|\\n|\\r)*?)<\/' + tagName + '>', 'g');
    },

    /*
     * let str = '    <myTag implicit-attr explicit-attr="value">Contents</myTag>';
     *
     * str.replace(regexpFactory.indentTag('myTag'), function($0, $1, $2, $3) {
     *     console.log($0); // '    <myTag implicit-attr explicit-attr="value">Contents</myTag>'
     *     console.log($1); // '    '
     *     console.log($2); // 'implicit-attr explicit-attr="value"'
     *     console.log($3); // 'Contents'
     * });
     */
    indentTag: function(tagName) {
        return new RegExp('( *?)<' + tagName + captureHtmlTagAttrs + '>((?:.|\\n|\\r)*?)<\/' + tagName + '>', 'g');
    },


    /*
     * let str = '    <myTag implicit-attr explicit-attr="value" />';
     *
     * str.replace(regexpFactory.voidTag('myTag'), function($0, $1) {
     *     console.log($0); // '<myTag implicit-attr explicit-attr="value" />'
     *     console.log($1); // 'implicit-attr explicit-attr="value"'
     * });
     */
    voidTag: function(tagName) {
        return new RegExp('<' + tagName + captureHtmlTagAttrs + ' \/>', 'g');
    },


    /*
     * let str = '    <myTag implicit-attr explicit-attr="value" />';
     *
     * str.replace(regexpFactory.indentVoidTag('myTag'), function($0, $1, $2) {
     *     console.log($0); // '    <myTag implicit-attr explicit-attr="value" />'
     *     console.log($1); // '    '
     *     console.log($2); // 'implicit-attr explicit-attr="value"'
     * });
     */
    indentVoidTag: function(tagName) {
        return new RegExp('( *?)<' + tagName + captureHtmlTagAttrs + ' \/>', 'g');
    },

    /*
     * let str = 'disabled class="one two-three  four" id="foobar"';
     * let strMatches = str.match(regexpFactory.tagAttrs);
     *
     * strMatches should be equal to the following:
     *
     * [
     *     'disabled',
     *     'class="one two-three  four"',
     *     'id="foobar"',
     * ]
     */
    tagAttrs: function() {
        return new RegExp('(?:(?:(?:\\S+)="(?:.*?)")|(?:\\S+))', 'g');
    }
};