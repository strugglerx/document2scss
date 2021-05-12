import * as parse5 from "parse5";
import * as jsbeautify from "js-beautify";

export class parseUtil {

    treenode :parse5.DocumentFragment

    constructor(context :string) {
        this.treenode = parse5.parseFragment(context);
    }

    /**
     * @description: filter text
     * @param {parse5} nodes
     * @return {*}
     */
    private _filterNode(nodes: parse5.ChildNode[]): parse5.ChildNode[]{
        return nodes.filter(i => i.nodeName !== '#text');
    }

    /**
     * @description: css Name
     * @param {parse5} node
     * @return {*}
     */
    private _makecss(node: parse5.Element):string {
        if (node.attrs && node.attrs.length > 0) {
            let id = node.attrs.find(i => i.name === 'id');
            let cls = node.attrs.find(i => i.name === 'class');
            if (id) {
                return `#${id.value}`;
            }
            if (cls) {
                return `.${cls.value.split(" ").join(" ,.")}`;
            }
            return `${node.nodeName}`;
        }
        else {
            return `${node.nodeName}`;
        }
    }

    /**
     * @description: element to scss 
     * @param {parse5} nodes
     * @return {*}
     */
    private _toscss(nodes: parse5.ChildNode[]):string  {
        let trim_nodes: parse5.ChildNode[] = this._filterNode(nodes);
        let current_depth:Array<string> = [];
        return trim_nodes.map((i, _i) => {
            let final: string = `${this._makecss((<parse5.Element>i))}{${this._toscss((<parse5.Element>i).childNodes)}}`
            if (current_depth.includes(final)) {
                return ""
            }
            current_depth.push(final)
            return final;
        }).filter(item => item != '').join('\n');
    }


    /**
     * @description: 格式化
     * @param {string} content
     * @return {*}
     */
    private _formatscss(content:string) {
        const defaultOptions = {
            insertSpaces: true,
            tabSize: 4,
            newline_between_rules: true,
        };
        const beautifyOptions = {
            indent_char: defaultOptions.insertSpaces ? ' ' : '\t',
            indent_size: defaultOptions.insertSpaces ? defaultOptions.tabSize : 1,
            newline_between_rules: defaultOptions.newline_between_rules ? defaultOptions.newline_between_rules : true,
        };
        let formatted = jsbeautify.css_beautify(content, beautifyOptions);
        if (!formatted) {
            return content;
        }
        return formatted;
    }

    /**
     * @description: 导出
     * @param {*}
     * @return {*}
     */
    public toscss() {
        return this._formatscss(this._toscss(this.treenode.childNodes));
    }
}
