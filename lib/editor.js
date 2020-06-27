
import { oTurndownService } from './turndown';
import { fnConvertFileFromURLToBase64, fnConvertImageFileFromURLToBase64 } from './utils'
import { fnSaveFromEditorToFile } from './download';

const __ALL__ = '__all__';

export const SimpleMDE = require('./simplemde-markdown-editor/src/js/simplemde');
export const CodeMirror = require("codemirror");

export function fnPrepareSimpleMDE (oHTMLElement, oOptions={}) {
  console.log(oHTMLElement);

  var oThis = this;

  oThis.oOptions = oOptions;

  oThis.oSimpleMDE = new SimpleMDE({
    autoDownloadFontAwesome: false,
    element: oHTMLElement, // this.$el.querySelector(sSelector),
    toolbar: [
      "bold",
      "italic",
      "strikethrough",
      "heading",
      "heading-smaller",
      "heading-bigger",
      "heading-1",
      "heading-2",
      "heading-3",
      "code",
      "quote",
      "unordered-list",
      "ordered-list",
      "clean-block",
      "link",
      "image",
      "table",
      "horizontal-rule",
      "preview",
      "side-by-side",
      "fullscreen",
      {
        name: "insert-picture",
        action: function customFunction(oEditor) {
          oThis.sUploadImagesMode = 'insert';
          oThis.$refs.uploaded_images_input.$el.click();
        },
        className: "fa fa-file-image",
        title: "Insert local picture"
      },
      {
        name: "insert-picture-from-collection",
        action: function (oEditor) {
          oThis.sUploadImagesMode = 'update-modal';
          oThis.$refs.images_modal.hideFooter = false;
          oThis.$refs.images_modal.show();
        },
        className: "fa fa-images",
        title: "Insert local picture"
      },
      {
        name: "insert-files-from-collection",
        action: function (oEditor) {
          oThis.sUploadFilesMode = 'update-modal';
          oThis.$refs.files_modal.hideFooter = false;
          oThis.$refs.files_modal.show();
        },
        className: "fa fa-file",
        title: "Insert file from collection"
      },
      {
        name: "insert-youtube-video",
        action: function (oEditor) {
          oThis.sYoutubeVideoURL = '';
          oThis.$refs.add_youtube_video_modal.hideFooter = false;
          oThis.$refs.add_youtube_video_modal.show();
        },
        className: "fa fa-youtube",
        title: "Insert youtube video"
      },
      {
        name: "replace-text",
        action: function (oEditor) {
          var oCodeMirror = oThis.oSimpleMDE.codemirror;

          if (!oThis.bShowReplacementBlock) {
            oThis.sSearchQuery = oCodeMirror.getSelection();
          }

          var oToolbarButton = oEditor.toolbarElements["replace-text"];

          if (oThis.bShowReplacementBlock) {
            oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
          } else {
            oToolbarButton.className += " active";
          }

          oToolbarButton = oEditor.toolbarElements["translate-text"];
          oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");

          oThis.bShowTranslationBlock = false;
          oThis.bShowReplacementBlock = !oThis.bShowReplacementBlock;

          setTimeout(
            function () {
              if (oThis.$refs.replacable_text_input.$el) {
                oThis.$refs.replacable_text_input.$el.focus();
              }
            },
            300
          );
        },
        className: "fa fa-sync",
        title: "Replace text"
      },
      {
        name: "translate-text",
        action: function (oEditor) {
          var oToolbarButton = oEditor.toolbarElements["translate-text"];

          if (oThis.bShowTranslationBlock) {
            oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
          } else {
            oToolbarButton.className += " active";
          }

          oToolbarButton = oEditor.toolbarElements["replace-text"];
          oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");

          oThis.bShowReplacementBlock = false;
          oThis.bShowTranslationBlock = !oThis.bShowTranslationBlock;
        },
        className: "fa fa-language",
        title: "Translate text"
      },
      {
        name: "save",
        action: function (oEditor) {
          oThis.fnSaveDocument();
        },
        className: "fa fa-save",
        title: "Save"
      },
      {
        name: "paste-as-text",
        action: function (oEditor) {
          var oToolbarButton = oEditor.toolbarElements["paste-as-text"];

          if (oThis.bPasteAsText) {
            oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
          } else {
            oToolbarButton.className += " active";
          }

          oThis.bPasteAsText = !oThis.bPasteAsText;
        },
        className: "fa fa-bars",
        title: "Paste as text"
      },
      {
        name: "paste-collapsable-block",
        action: function (oEditor) {
          var oCodeMirror = oThis.oSimpleMDE.codemirror;
          var sSelection = oCodeMirror.getSelection();

          oCodeMirror.replaceSelection(
            "\
<details><summary>   </summary>\n\
\n\
" + sSelection + "\n\
\n\
</details>\n\
"
          );
        },
        className: "fa fa-outdent",
        title: "Insert collapsable block"
      },
      {
        name: "insert-math",
        action: function (oEditor) {
          oThis.$refs.mathjax_modal.hideFooter = false;
          oThis.$refs.mathjax_modal.show();
        },
        className: "fa fa-square-root-alt",
        title: "Insert math formula"
      },
    ]
  });

  oThis.codemirror = oThis.oSimpleMDE.codemirror;

  console.log(oThis.oSimpleMDE, oThis.codemirror);

  // var fnSaveDocument = () => {
  //   fnSaveFromEditorToFile(oThis.codemirror);
  // };
  oThis.fnSaveDocument = oThis.fnSaveDocument || fnSaveFromEditorToFile.bind(oThis);

  var oExtraKeys = oThis.oSimpleMDE.codemirror.getOption("extraKeys");
  oExtraKeys["Ctrl-S"] = function () {
    oThis.fnSaveDocument();
  };
  oThis.oSimpleMDE.codemirror.setOption("extraKeys", oExtraKeys);

  oThis.oSimpleMDE.codemirror.on(
    'change',
    function (oCodeMirror) {
      console.log('codemirror - onchange');
      oThis.bEditorDirty = true;
    }
  );

  oThis.oSimpleMDE.codemirror.on(
    'scroll',
    function (oCodeMirror, oEvent) {
      //console.log('codemirror - onscroll');
      var bIgnoreArticleViewScrollEvents = oThis.bIgnoreArticleViewScrollEvents;
      oThis.bIgnoreArticleViewScrollEvents = false;
      if (bIgnoreArticleViewScrollEvents) return false;

      if (oThis.bLockArticleViewScroll) {
        oThis.bIgnoreArticleViewScrollEvents = true;

        oThis.$refs.article_view_contents.scrollTop =
          oCodeMirror.display.scroller.scrollTop /
          (oCodeMirror.display.scroller.scrollHeight - oCodeMirror.display.scroller.clientHeight) *
          (oThis.$refs.article_view_contents.scrollHeight - oThis.$refs.article_view_contents.clientHeight);
      }
    }
  );

  oThis.oSimpleMDE.codemirror.on(
    'paste',
    async function (oCodeMirror, oEvent) {
      console.log('codemirror - paste');

      var oClipboardData = (oEvent.clipboardData || window.clipboardData);

      for (var iIndex in oClipboardData.items) {
        var oItem = oClipboardData.items[iIndex];

        if (oItem.kind == 'file') {
          var oFile = oItem.getAsFile();
          var oFileReader = new FileReader();
          oFileReader.onloadend = function() {
            oCodeMirror.replaceSelection('![](' + oFileReader.result + ')');
          };
          oFileReader.readAsDataURL(oFile);

          // oThis.bShowLoadingScreen = true;

          // var oFile = oItem.getAsFile();

          // var oFormData = new FormData();

          // oFormData.append('action', 'upload_images');
          // oFormData.append('repository', oThis.oRepository.sName);
          // oFormData.append('pasted_files[]', oFile);

          // oThis
          //   .$http
          //   .post(
          //     '',
          //     oFormData
          //   ).then(function (oResponse) {
          //     oThis.bShowLoadingScreen = false;

          //     if (oResponse.body.status == 'error') {
          //       oThis.$snotify.error(oResponse.body.message, 'Error');
          //       return;
          //     }

          //     oCodeMirror.replaceSelection('![](/images/' + oResponse.body.data[0] + ')');
          //   })
          //   .catch(function (sError) {
          //     oThis.$snotify.error(sError);
          //     oThis.bShowLoadingScreen = false;
          //   });

          return;
        }
      }

      if (oThis.bPasteAsText) {
        var sText = oClipboardData.getData('text/plain');
        oCodeMirror.replaceSelection(sText);

        oEvent.preventDefault();

        return;
      }

      if (oClipboardData.types.indexOf('text/html') == -1)
        return;

      var sText = oTurndownService.turndown(oClipboardData.getData('text/html'));

      var oLinksMatch;
      var oURLMatch;

      if ((oLinksMatch = sText.match(/!\[[^\]]*\]\([^)]*\)/gu)) !== null) {
        // var aURLs = [];
        var oURLs = {};

        for (var iIndex = 0; iIndex < oLinksMatch.length; iIndex++) {
          if ((oURLMatch = oLinksMatch[iIndex].match(/\((https?:.*?)(\s+["'].*?["'])?\)/u)) !== null) {
            // aURLs.push(oURLMatch[1]);
            oURLs[iIndex] = oURLMatch[1];
          }
        }

        // NOTE: convert url to base64

        for (var iIndex in oURLs) {
          var sURL = oURLs[iIndex];
          var sLinkMatch = oLinksMatch[iIndex];

          console.log(sURL);
          // var sBase64 = await fnConvertImageFileFromURLToBase64(sURL);
          var sBase64 = await fnConvertFileFromURLToBase64(sURL);
          console.log(sBase64);

          var sNewLink = sLinkMatch.replace(/\(https?:.*?\)/u, `(${sBase64})`);
          var sText = sText.replace(sLinkMatch, sNewLink);

          oCodeMirror.replaceSelection(sText);
        }

        // oThis.bShowLoadingScreen = true;

        // oThis
        //   .$http
        //   .post(
        //     '', {
        //       action: 'add_images_from_urls',
        //       repository: oThis.oRepository.sName,
        //       urls: aURLs
        //     }
        //   ).then(function (oResponse) {
        //     oThis.bShowLoadingScreen = false;

        //     if (oResponse.body.status == 'error') {
        //       oThis.$snotify.error(oResponse.body.message, 'Error');
        //       return;
        //     }

        //     for (var iDataIndex = 0; iDataIndex < oResponse.body.data.length; iDataIndex++) {
        //       for (var iIndex = 0; iIndex < oLinksMatch.length; iIndex++) {
        //         if (oLinksMatch[iIndex].indexOf(oResponse.body.data[iDataIndex]['sURL']) !== -1) {
        //           var sNewLink = oLinksMatch[iIndex].replace(/\(https?:.*?\)/u, "(/images/" + oResponse.body.data[iDataIndex]['sFileName'] + ")");
        //           sText = sText.replace(oLinksMatch[iIndex], sNewLink);
        //           break;
        //         }
        //       }
        //     }

        //     oCodeMirror.replaceSelection(sText);
        //   })
        //   .catch(function (sError) {
        //     oThis.$snotify.error(sError);
        //     oThis.bShowLoadingScreen = false;
        //   });
      } else {
        oCodeMirror.replaceSelection(sText);
      }

      oEvent.preventDefault();
    }
  );

  (function (CodeMirror) {
    var Pos = CodeMirror.Pos;

    function regexpFlags(regexp) {
      var flags = regexp.flags
      return flags != null ? flags : (regexp.ignoreCase ? "i" : "") +
        (regexp.global ? "g" : "") +
        (regexp.multiline ? "m" : "")
    }

    function ensureFlags(regexp, flags) {
      var current = regexpFlags(regexp),
        target = current
      for (var i = 0; i < flags.length; i++)
        if (target.indexOf(flags.charAt(i)) == -1)
          target += flags.charAt(i)
      return current == target ? regexp : new RegExp(regexp.source, target)
    }

    function maybeMultiline(regexp) {
      return /\\s|\\n|\n|\\W|\\D|\[\^/.test(regexp.source)
    }

    function searchRegexpForward(doc, regexp, start) {
      regexp = ensureFlags(regexp, "g")
      for (var line = start.line, ch = start.ch, last = doc.lastLine(); line <= last; line++, ch = 0) {
        regexp.lastIndex = ch
        var string = doc.getLine(line),
          match = regexp.exec(string)
        if (match)
          return {
            from: Pos(line, match.index),
            to: Pos(line, match.index + match[0].length),
            match: match
          }
      }
    }

    function searchRegexpForwardMultiline(doc, regexp, start) {
      if (!maybeMultiline(regexp)) return searchRegexpForward(doc, regexp, start)

      regexp = ensureFlags(regexp, "gm")
      var string, chunk = 1
      for (var line = start.line, last = doc.lastLine(); line <= last;) {
        // This grows the search buffer in exponentially-sized chunks
        // between matches, so that nearby matches are fast and don't
        // require concatenating the whole document (in case we're
        // searching for something that has tons of matches), but at the
        // same time, the amount of retries is limited.
        for (var i = 0; i < chunk; i++) {
          if (line > last) break
          var curLine = doc.getLine(line++)
          string = string == null ? curLine : string + "\n" + curLine
        }
        chunk = chunk * 2
        regexp.lastIndex = start.ch
        var match = regexp.exec(string)
        if (match) {
          var before = string.slice(0, match.index).split("\n"),
            inside = match[0].split("\n")
          var startLine = start.line + before.length - 1,
            startCh = before[before.length - 1].length
          return {
            from: Pos(startLine, startCh),
            to: Pos(startLine + inside.length - 1,
              inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length),
            match: match
          }
        }
      }
    }

    function lastMatchIn(string, regexp) {
      var cutOff = 0,
        match
      for (;;) {
        regexp.lastIndex = cutOff
        var newMatch = regexp.exec(string)
        if (!newMatch) return match
        match = newMatch
        cutOff = match.index + (match[0].length || 1)
        if (cutOff == string.length) return match
      }
    }

    function searchRegexpBackward(doc, regexp, start) {
      regexp = ensureFlags(regexp, "g")
      for (var line = start.line, ch = start.ch, first = doc.firstLine(); line >= first; line--, ch = -1) {
        var string = doc.getLine(line)
        if (ch > -1) string = string.slice(0, ch)
        var match = lastMatchIn(string, regexp)
        if (match)
          return {
            from: Pos(line, match.index),
            to: Pos(line, match.index + match[0].length),
            match: match
          }
      }
    }

    function searchRegexpBackwardMultiline(doc, regexp, start) {
      regexp = ensureFlags(regexp, "gm")
      var string, chunk = 1
      for (var line = start.line, first = doc.firstLine(); line >= first;) {
        for (var i = 0; i < chunk; i++) {
          var curLine = doc.getLine(line--)
          string = string == null ? curLine.slice(0, start.ch) : curLine + "\n" + string
        }
        chunk *= 2

        var match = lastMatchIn(string, regexp)
        if (match) {
          var before = string.slice(0, match.index).split("\n"),
            inside = match[0].split("\n")
          var startLine = line + before.length,
            startCh = before[before.length - 1].length
          return {
            from: Pos(startLine, startCh),
            to: Pos(startLine + inside.length - 1,
              inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length),
            match: match
          }
        }
      }
    }

    var doFold, noFold
    if (String.prototype.normalize) {
      doFold = function (str) {
        return str.normalize("NFD").toLowerCase()
      }
      noFold = function (str) {
        return str.normalize("NFD")
      }
    } else {
      doFold = function (str) {
        return str.toLowerCase()
      }
      noFold = function (str) {
        return str
      }
    }

    // Maps a position in a case-folded line back to a position in the original line
    // (compensating for codepoints increasing in number during folding)
    function adjustPos(orig, folded, pos, foldFunc) {
      if (orig.length == folded.length) return pos
      for (var min = 0, max = pos + Math.max(0, orig.length - folded.length);;) {
        if (min == max) return min
        var mid = (min + max) >> 1
        var len = foldFunc(orig.slice(0, mid)).length
        if (len == pos) return mid
        else if (len > pos) max = mid
        else min = mid + 1
      }
    }

    function searchStringForward(doc, query, start, caseFold) {
      // Empty string would match anything and never progress, so we
      // define it to match nothing instead.
      if (!query.length) return null
      var fold = caseFold ? doFold : noFold
      var lines = fold(query).split(/\r|\n\r?/)

      search: for (var line = start.line, ch = start.ch, last = doc.lastLine() + 1 - lines.length; line <= last; line++, ch = 0) {
        var orig = doc.getLine(line).slice(ch),
          string = fold(orig)
        if (lines.length == 1) {
          var found = string.indexOf(lines[0])
          if (found == -1) continue search
          var start = adjustPos(orig, string, found, fold) + ch
          return {
            from: Pos(line, adjustPos(orig, string, found, fold) + ch),
            to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold) + ch)
          }
        } else {
          var cutFrom = string.length - lines[0].length
          if (string.slice(cutFrom) != lines[0]) continue search
          for (var i = 1; i < lines.length - 1; i++)
            if (fold(doc.getLine(line + i)) != lines[i]) continue search
          var end = doc.getLine(line + lines.length - 1),
            endString = fold(end),
            lastLine = lines[lines.length - 1]
          if (endString.slice(0, lastLine.length) != lastLine) continue search
          return {
            from: Pos(line, adjustPos(orig, string, cutFrom, fold) + ch),
            to: Pos(line + lines.length - 1, adjustPos(end, endString, lastLine.length, fold))
          }
        }
      }
    }

    function searchStringBackward(doc, query, start, caseFold) {
      if (!query.length) return null
      var fold = caseFold ? doFold : noFold
      var lines = fold(query).split(/\r|\n\r?/)

      search: for (var line = start.line, ch = start.ch, first = doc.firstLine() - 1 + lines.length; line >= first; line--, ch = -1) {
        var orig = doc.getLine(line)
        if (ch > -1) orig = orig.slice(0, ch)
        var string = fold(orig)
        if (lines.length == 1) {
          var found = string.lastIndexOf(lines[0])
          if (found == -1) continue search
          return {
            from: Pos(line, adjustPos(orig, string, found, fold)),
            to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold))
          }
        } else {
          var lastLine = lines[lines.length - 1]
          if (string.slice(0, lastLine.length) != lastLine) continue search
          for (var i = 1, start = line - lines.length + 1; i < lines.length - 1; i++)
            if (fold(doc.getLine(start + i)) != lines[i]) continue search
          var top = doc.getLine(line + 1 - lines.length),
            topString = fold(top)
          if (topString.slice(topString.length - lines[0].length) != lines[0]) continue search
          return {
            from: Pos(line + 1 - lines.length, adjustPos(top, topString, top.length - lines[0].length, fold)),
            to: Pos(line, adjustPos(orig, string, lastLine.length, fold))
          }
        }
      }
    }

    function SearchCursor(doc, query, pos, options) {
      this.atOccurrence = false
      this.doc = doc
      pos = pos ? doc.clipPos(pos) : Pos(0, 0)
      this.pos = {
        from: pos,
        to: pos
      }

      var caseFold
      if (typeof options == "object") {
        caseFold = options.caseFold
      } else { // Backwards compat for when caseFold was the 4th argument
        caseFold = options
        options = null
      }

      if (typeof query == "string") {
        if (caseFold == null) caseFold = false
        this.matches = function (reverse, pos) {
          return (reverse ? searchStringBackward : searchStringForward)(doc, query, pos, caseFold)
        }
      } else {
        query = ensureFlags(query, "gm")
        if (!options || options.multiline !== false)
          this.matches = function (reverse, pos) {
            return (reverse ? searchRegexpBackwardMultiline : searchRegexpForwardMultiline)(doc, query, pos)
          }
        else
          this.matches = function (reverse, pos) {
            return (reverse ? searchRegexpBackward : searchRegexpForward)(doc, query, pos)
          }
      }
    }

    SearchCursor.prototype = {
      findNext: function () {
        return this.find(false)
      },
      findPrevious: function () {
        return this.find(true)
      },

      find: function (reverse) {
        var result = this.matches(reverse, this.doc.clipPos(reverse ? this.pos.from : this.pos.to))

        // Implements weird auto-growing behavior on null-matches for
        // backwards-compatiblity with the vim code (unfortunately)
        while (result && CodeMirror.cmpPos(result.from, result.to) == 0) {
          if (reverse) {
            if (result.from.ch) result.from = Pos(result.from.line, result.from.ch - 1)
            else if (result.from.line == this.doc.firstLine()) result = null
            else result = this.matches(reverse, this.doc.clipPos(Pos(result.from.line - 1)))
          } else {
            if (result.to.ch < this.doc.getLine(result.to.line).length) result.to = Pos(result.to.line, result.to.ch + 1)
            else if (result.to.line == this.doc.lastLine()) result = null
            else result = this.matches(reverse, Pos(result.to.line + 1, 0))
          }
        }

        if (result) {
          this.pos = result
          this.atOccurrence = true
          return this.pos.match || true
        } else {
          var end = Pos(reverse ? this.doc.firstLine() : this.doc.lastLine() + 1, 0)
          this.pos = {
            from: end,
            to: end
          }
          return this.atOccurrence = false
        }
      },

      from: function () {
        if (this.atOccurrence) return this.pos.from
      },
      to: function () {
        if (this.atOccurrence) return this.pos.to
      },

      replace: function (newText, origin) {
        if (!this.atOccurrence) return
        var lines = CodeMirror.splitLines(newText)
        this.doc.replaceRange(lines, this.pos.from, this.pos.to, origin)
        this.pos.to = Pos(this.pos.from.line + lines.length - 1,
          lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0))
      }
    }

    CodeMirror.defineExtension("getSearchCursor", function (query, pos, caseFold) {
      return new SearchCursor(this.doc, query, pos, caseFold)
    })
    CodeMirror.defineDocExtension("getSearchCursor", function (query, pos, caseFold) {
      return new SearchCursor(this, query, pos, caseFold)
    })

    CodeMirror.defineExtension("selectMatches", function (query, caseFold) {
      var ranges = []
      var cur = this.getSearchCursor(query, this.getCursor("from"), caseFold)
      while (cur.findNext()) {
        if (CodeMirror.cmpPos(cur.to(), this.getCursor("to")) > 0) break
        ranges.push({
          anchor: cur.from(),
          head: cur.to()
        })
      }
      if (ranges.length)
        this.setSelections(ranges, 0)
    })

  })(oThis.oSimpleMDE.CodeMirror);

  return oThis.oSimpleMDE;
};

export function fnPrepareCodeMirrorfromTextArea(oHTMLElement, options={})
{
  var oThis = this;

  var mode;
  var backdrop;
  var keyMaps = {};

  var oOptions = {
    mode: mode,
    backdrop: backdrop,
    theme: "paper",
    tabSize: (options.tabSize != undefined) ? options.tabSize : 2,
    indentUnit: (options.tabSize != undefined) ? options.tabSize : 2,
    indentWithTabs: (options.indentWithTabs === false) ? false : true,
    lineNumbers: true,
    autofocus: (options.autofocus === true) ? true : false,
    extraKeys: keyMaps,
    lineWrapping: false, // (options.lineWrapping === false) ? false : true,
    allowDropFileTypes: ["text/plain"],
    placeholder: options.placeholder || oHTMLElement.getAttribute("placeholder") || "",
    styleSelectedText: (options.styleSelectedText != undefined) ? options.styleSelectedText : true
  };

  oThis.codemirror = CodeMirror.fromTextArea(
    oHTMLElement, 
    oOptions
  );

  return oThis;
}