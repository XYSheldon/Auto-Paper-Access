// ==UserScript==
// @name         Auto Paper Access (NTU/NUS)
// @copyright    2024, XYSheldon (https://github.com/XYSheldon)
// @version      8.3
// @description  A simple script runs on Tampermonkey. You can easily access IEEE Xplore, ACM Digital Library, etc without clicking proxy bookmarklet provided by universities.
// @author       lushl9301, koallen, XYSheldon
// @license      MIT
// @run-at       document-body
// @match        www.sciencedirect.com/*
// @match        ieeexplore.ieee.org/*
// @match        dl.acm.org/*
// @match        *.springer.com/*
// @match        onlinelibrary.wiley.com/doi/*
// @match        www.ncbi.nlm.nih.gov/pubmed/*
// @match        epubs.siam.org/*
// @match        www.nature.com/*
// @match        pubsonline.informs.org/*
// @match        *.remotexs.ntu.edu.sg/*
// @match        *.libproxy1.nus.edu.sg/*
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM.getValue
// @grant              GM.setValue
// ==/UserScript==

/* jshint esversion: 8 */
/* globals GM_config, GM_configStruct */

(function() {
    'use strict';

    // initialization
    var currUniversity, prevUniversity;
    var defaultUniversity = '====N.A.====';
    GM_config.init(
        {
            'id': 'universityConfig',
            'title': 'Choose your university',
            'fields':
            {
                'active':
                {
                    'label': 'Enable',
                    'type': 'checkbox',
                    'default': true
                },
                'university': // field id
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
                    //alert(currUniversity);
                    if (GM_config.get('active')) {
                        if (currUniversity === defaultUniversity) {
                            GM_config.open();
                        } else if ("Nanyang Technological University" === currUniversity) {
                            if (!location.href.includes("remotexs.ntu.edu.sg")) {
                                //Provided by NTU Library: javascript:void(location.href=%22https://remotexs.ntu.edu.sg/user/login?dest=%22+location.href)
                                location.href = "https://remotexs.ntu.edu.sg/user/login?dest=" + location.href;
                            }
                        } else if ('National University of Singapore' == currUniversity) {
                            if (!location.href.includes("libproxy1.nus.edu.sg")) {
                                location.href = "http://libproxy1.nus.edu.sg/login?url=" + location.href;
                            }
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
                    alert(currUniversity);
                    if (prevUniversity !== currUniversity)
                        location.reload();
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

    currUniversity = GM_config.get('university');
    // alert(currUniversity);
    // display config or access with uni account

})();
