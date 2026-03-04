// ==UserScript==
// @name         Auto Paper Access (NTU/NUS)
// @copyright    2026, XYSheldon (https://github.com/XYSheldon)
// @version      9.0
// @description  A simple script runs on Tampermonkey. You can easily access IEEE Xplore, ACM Digital Library, etc without clicking proxy bookmarklet provided by universities. Updated by XYSheldon.
// @author       lushl9301, koallen, XYSheldon
// @license      MIT
// @run-at       document-body
// @noframes
// @match        *://www.sciencedirect.com/*
// @match        *://ieeexplore.ieee.org/*
// @match        *://digital-library.theiet.org/*
// @match        *://dl.acm.org/*
// @match        *://*.springer.com/*
// @match        *://onlinelibrary.wiley.com/*
// @match        *://www.ncbi.nlm.nih.gov/pubmed/*
// @match        *://epubs.siam.org/*
// @match        *://www.nature.com/*
// @match        *://pubsonline.informs.org/*
// @match        *://*.remotexs.ntu.edu.sg/*
// @match        *://*.libproxy1.nus.edu.sg/*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=256&domain_url=ieee.org
// @updateURL    https://github.com/XYSheldon/Auto-Paper-Access/raw/master/auto-paper-access.user.js
// @downloadURL  https://github.com/XYSheldon/Auto-Paper-Access/raw/master/auto-paper-access.user.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
    'use strict';

    var defaultUniversity = '====N.A.====';
    var universityOptions = [defaultUniversity, 'Nanyang Technological University', 'National University of Singapore'];

    function getCfg(key, def) {
        return GM_getValue(key, def);
    }

    function setCfg(key, val) {
        GM_setValue(key, val);
    }

    function openConfig() {
        if (document.getElementById('apa-config-overlay')) { return; }

        var active     = getCfg('active', false);
        var pdfjump    = getCfg('pdfjump_ieee', false);
        var university = getCfg('university', defaultUniversity);

        // Overlay backdrop
        var overlay = document.createElement('div');
        overlay.id = 'apa-config-overlay';
        overlay.style.cssText = [
            'all:initial',
            'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
            'background:rgba(0,0,0,0.5)', 'z-index:2147483646',
            'display:flex', 'align-items:center', 'justify-content:center'
        ].join(';');

        // Panel
        var panel = document.createElement('div');
        panel.style.cssText = [
            'all:initial',
            'display:block',
            'background:#ffffff', 'color:#222222',
            'border:1px solid #cccccc', 'border-radius:6px',
            'padding:24px', 'width:340px',
            'font-family:Arial,sans-serif', 'font-size:14px', 'line-height:1.5',
            'box-shadow:0 4px 16px rgba(0,0,0,0.3)',
            'box-sizing:border-box'
        ].join(';');

        // Title
        var title = document.createElement('h2');
        title.textContent = 'Auto Paper Access (NTU/NUS)';
        title.style.cssText = 'all:initial;display:block;margin:0 0 16px 0;font-size:16px;font-weight:bold;color:#222222;font-family:Arial,sans-serif;line-height:1.4;';

        // Enable checkbox row
        var cbActive = makeCheckbox('apa-active', 'Enable', active);
        var row1 = makeRow();
        row1.appendChild(cbActive.label);

        // IEEE PDF jump checkbox row
        var cbPdf = makeCheckbox('apa-pdfjump', 'IEEE Xplore PDF Auto Jump', pdfjump);
        var row2 = makeRow();
        row2.appendChild(cbPdf.label);

        // University select row
        var row3 = makeRow();
        var selLabel = document.createElement('label');
        selLabel.htmlFor = 'apa-university';
        selLabel.style.cssText = 'all:initial;display:inline;color:#222222;font-family:Arial,sans-serif;font-size:14px;';
        selLabel.appendChild(document.createTextNode('University: '));
        var sel = document.createElement('select');
        sel.id = 'apa-university';
        sel.style.cssText = [
            'all:initial',
            'display:inline-block',
            'margin-left:6px', 'padding:2px 6px',
            'font-family:Arial,sans-serif', 'font-size:14px', 'color:#222222',
            'background:#ffffff', 'border:1px solid #cccccc', 'border-radius:4px'
        ].join(';');
        universityOptions.forEach(function(opt) {
            var o = document.createElement('option');
            o.value = opt;
            o.textContent = opt;
            if (opt === university) { o.selected = true; }
            sel.appendChild(o);
        });
        selLabel.appendChild(sel);
        row3.appendChild(selLabel);

        // Button row
        var btnRow = makeRow();
        btnRow.style.cssText += ';margin-top:20px;text-align:right;';
        var btnClose = makeActionButton('Cancel', '#f1f3f4', '#222222');
        var btnSave  = makeActionButton('Save',   '#1a73e8', '#ffffff');
        btnRow.appendChild(btnClose);
        btnRow.appendChild(btnSave);

        btnSave.addEventListener('click', function() {
            var prevUniversity = university;
            var newUniversity  = sel.value;
            setCfg('active',       cbActive.input.checked);
            setCfg('pdfjump_ieee', cbPdf.input.checked);
            setCfg('university',   newUniversity);
            alert('Saved!\n' + newUniversity);
            document.body.removeChild(overlay);
            if (prevUniversity !== newUniversity) {
                location.reload();
            }
        });
        btnClose.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) { document.body.removeChild(overlay); }
        });

        panel.appendChild(title);
        panel.appendChild(row1);
        panel.appendChild(row2);
        panel.appendChild(row3);
        panel.appendChild(btnRow);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    function makeRow() {
        var d = document.createElement('div');
        d.style.cssText = 'all:initial;display:block;margin-bottom:12px;';
        return d;
    }

function makeCheckbox(id, labelText, checked) {
    var label = document.createElement('label');
    label.htmlFor = id;
    label.style.cssText = [
        'all:initial',
        'display:flex',
        'align-items:center',
        'gap:8px',
        'color:#222222',
        'font-family:Arial,sans-serif',
        'font-size:14px',
        'line-height:1.4',
        'cursor:pointer',
        'box-sizing:border-box'
    ].join(';');

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = checked;

    // 不使用 all:initial，避免抹掉原生 checkbox 外观
    input.style.cssText = [
        'display:inline-block',
        'width:16px',
        'height:16px',
        'margin:0',
        'padding:0',
        'vertical-align:middle',
        'cursor:pointer',
        'box-sizing:border-box',
        'appearance:auto',
        '-webkit-appearance:checkbox',
        '-moz-appearance:checkbox',
        'accent-color:#1a73e8',
        'opacity:1',
        'visibility:visible',
        'background:Canvas',
        'border:initial'
    ].join(';');

    label.appendChild(input);
    label.appendChild(document.createTextNode(labelText));
    return { label: label, input: input };
}
    
    function makeActionButton(text, bg, fg) {
        var btn = document.createElement('button');
        btn.textContent = text;
        btn.type = 'button';
        btn.style.cssText = [
            'all:initial',
            'display:inline-block', 'margin-left:8px',
            'padding:8px 16px',
            'font-family:Arial,sans-serif', 'font-size:14px', 'font-weight:normal',
            'background:' + bg, 'color:' + fg,
            'border:1px solid #cccccc', 'border-radius:4px',
            'cursor:pointer', 'line-height:1.4',
            'box-sizing:border-box'
        ].join(';');
        return btn;
    }

    // Initialization: apply proxy redirect if enabled
    var currUniversity = getCfg('university', defaultUniversity);
    var viaProxy = false;

    if (getCfg('active', false)) {
        if (currUniversity === defaultUniversity) {
            openConfig();
        } else if ('Nanyang Technological University' === currUniversity) {
            //Provided by NTU Library: javascript:void(location.href=%22https://remotexs.ntu.edu.sg/user/login?dest=%22+location.href)
            if (!location.href.includes('remotexs.ntu.edu.sg')) {
                location.href = 'https://remotexs.ntu.edu.sg/user/login?dest=' + location.href;
            } else {
                viaProxy = true;
            }
        } else if ('National University of Singapore' === currUniversity) {
            //Provided by NUS Library: javascript:void(location.href='https://libproxy1.nus.edu.sg/login?url='+location.href)
            if (!location.href.includes('libproxy1.nus.edu.sg')) {
                location.href = 'https://libproxy1.nus.edu.sg/login?url=' + location.href;
            } else {
                viaProxy = true;
            }
        }

        if (viaProxy && location.href.includes('ieeexplore') && location.href.includes('document')) {
            // IEEE Xplore Auto Jump to PDF
            var articleId = location.href.match('[0-9]{5,}');
            if (articleId !== null) {
                var pdfurl = 'https://' + location.hostname + '/stamp/stamp.jsp?tp=&arnumber=' + articleId[0];
                if (getCfg('pdfjump_ieee', false)) {
                    location.href = pdfurl;
                }
            }
        }
    }

    // Fixed-style toggle button — unaffected by host page CSS
    var button = document.createElement('button');
    button.textContent = 'Auto Paper Access (NTU/NUS)';
    button.type = 'button';
    button.style.cssText = [
        'all:initial',
        'display:block',
        'position:fixed', 'top:7em', 'right:1em',
        'z-index:2147483645',
        'padding:8px 14px',
        'font-family:Arial,sans-serif', 'font-size:13px', 'font-weight:bold', 'line-height:1.4',
        'color:#ffffff', 'background:#1a73e8',
        'border:none', 'border-radius:6px',
        'cursor:pointer',
        'box-shadow:0 2px 8px rgba(0,0,0,0.3)',
        'box-sizing:border-box'
    ].join(';');
    button.addEventListener('click', openConfig, false);
    document.body.appendChild(button);

})();
