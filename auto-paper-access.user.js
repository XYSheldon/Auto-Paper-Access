// ==UserScript==
// @name         Auto Paper Access (NTU/NUS)
// @copyright    2024, XYSheldon (https://github.com/XYSheldon)
// @version      8.9
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
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @icon         https://www.google.com/s2/favicons?sz=256&domain_url=ieee.org
// @updateURL    https://github.com/XYSheldon/Auto-Paper-Access/raw/master/auto-paper-access.user.js
// @downloadURL  https://github.com/XYSheldon/Auto-Paper-Access/raw/master/auto-paper-access.user.js
// ==/UserScript==

/* jshint esversion: 8 */
/* globals GM_config, GM_configStruct */

(function() {
    'use strict';

    // initialization
    var currUniversity, prevUniversity, viaProxy;
    var defaultUniversity = '====N.A.====';
    GM_config.init(
        {
            'id': 'universityConfig',
            'title': 'Auto Paper Access (NTU/NUS)',
            'fields':
            {
                'active':
                {
                    'label': 'Enable',
                    'type': 'checkbox',
                    'default': false
                },
                'pdfjump_ieee':
                {
                    'label': 'IEEE Xplore PDF Auto Jump',
                    'type': 'checkbox',
                    'default': false
                },
                'university':
                {
                    'label': 'University',
                    'type': 'select',
                    'options': [defaultUniversity, 'Nanyang Technological University', 'National University of Singapore'],
                    'default': defaultUniversity
                }

            },
            'events':
            {
                'init': function() {
                    currUniversity = GM_config.get('university');
                    viaProxy = false;
                    //alert(currUniversity);
                    if (GM_config.get('active')) {
                        if (currUniversity === defaultUniversity) {
                            GM_config.open();
                        } else if ("Nanyang Technological University" === currUniversity) {
                            if (!location.href.includes("remotexs.ntu.edu.sg")) {
                                //Provided by NTU Library: javascript:void(location.href=%22https://remotexs.ntu.edu.sg/user/login?dest=%22+location.href)
                                location.href = "https://remotexs.ntu.edu.sg/user/login?dest=" + location.href;
                            } else {
                                viaProxy = true;
                            }
                        } else if ('National University of Singapore' == currUniversity) {
                                //Provided by NUS Library: javascript:void(location.href='https://libproxy1.nus.edu.sg/login?url='+location.href)
                            if (!location.href.includes("libproxy1.nus.edu.sg")) {
                                location.href = "https://libproxy1.nus.edu.sg/login?url=" + location.href;
                            } else {
                                viaProxy = true;
                            }
                        }
                        if (viaProxy&&(location.href.includes("ieeexplore"))&&(location.href.includes("document"))) {
                            // IEEE Xpolore Auto Jump
                            var articleId = location.href.match("[0-9]{5,}");
                            if (articleId != null)
                            {
                                var pdfurl = "https://" + location.hostname + "/stamp/stamp.jsp?tp=&arnumber=" + articleId;
                                //alert(pdfurl);
                                if (GM_config.get('pdfjump_ieee')) {
                                    location.href = pdfurl;
                                }
                            }

                            //A method based on querySelector, slower.
                            //var pdfbutton = document.querySelector("a.pdf-btn-link");
                        }
                    }
                },
                'open': function() {
                    // custom layout
                    var config_ui = this.frame;
                    config_ui.style.height = '';
                    config_ui.style.margin = 'auto';
                    config_ui.style.width = '20%';
                    config_ui.style.left = '40%';
                    GM_config.fields['university'].node.addEventListener('change', function () {
                        currUniversity = GM_config.fields['university'].toValue();
                    }, false);
                    GM_config.fields['university'].node.addEventListener('focus', function() {
                        prevUniversity = GM_config.fields['university'].toValue();
                    }, false);
                },
                'save': function() {
                    alert("Saved!\n"+currUniversity);
                    if (prevUniversity !== currUniversity) {
                        location.reload();
                    }
                }
            },
            'css': '#universityConfig .config_header { font-size: 20px; margin: 0 0 10 0; }'
        });

    // display a button to toggle config panel
    var button = document.createElement('button');
    button.innerHTML = "Auto Paper Access (NTU/NUS)";
    button.style = "top:7em;right:1em;position:fixed;z-index: 9999";
    button.setAttribute('type', 'button');
    button.addEventListener('click', function(){GM_config.open();}, false);
    document.body.appendChild(button);

    // currUniversity = GM_config.get('university');
    // alert(currUniversity);
    // display config or access with uni account

})();
