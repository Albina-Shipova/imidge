(function () {
    "use strict";

    var inlineSelector =
        'script[type="text/x-abrand-deferred"]' +
        '[data-perf-inline-deferred="v1"]';

    function isAnalytics(code) {
        return (
            code.indexOf("googletagmanager.com") !== -1 ||
            code.indexOf("window.dataLayer") !== -1 ||
            code.indexOf("function gtag") !== -1 ||
            code.indexOf("Ya.Metrika") !== -1 ||
            code.indexOf("mc.yandex.ru") !== -1
        );
    }

    function executeInline(node) {
        var replacement = document.createElement("script");
        replacement.setAttribute("data-perf-inline-executed", "v3");
        replacement.text = node.textContent || "";
        node.parentNode.insertBefore(replacement, node);
        node.parentNode.removeChild(node);
    }

    var functionalNodes = [];
    Array.prototype.slice.call(
        document.querySelectorAll(inlineSelector)
    ).forEach(function (node) {
        if (isAnalytics(node.textContent || "")) {
            node.setAttribute(
                "data-perf-analytics-inline",
                "immediate-async-v4"
            );
            return;
        }
        functionalNodes.push(node);
    });

    function executeFunctional(index) {
        if (index >= functionalNodes.length) {
            window.__abrandFunctionalReady = true;
            window.dispatchEvent(
                new CustomEvent("abrand:functional-ready")
            );
            return;
        }
        executeInline(functionalNodes[index]);
        window.setTimeout(function () {
            executeFunctional(index + 1);
        }, 0);
    }
    window.setTimeout(function () {
        executeFunctional(0);
    }, 0);

    var flushed = false;
    var timer = null;
    var interactionEvents = [
        "pointerdown",
        "touchstart",
        "keydown",
        "wheel",
        "scroll"
    ];

    function removeInteractionListeners() {
        interactionEvents.forEach(function (eventName) {
            window.removeEventListener(
                eventName,
                flushAnalytics,
                false
            );
        });
    }

    function flushAnalytics() {
        if (flushed) {
            return;
        }
        flushed = true;
        if (timer !== null) {
            window.clearTimeout(timer);
        }
        removeInteractionListeners();

        var selector =
            "script[data-perf-analytics-src]," +
            "script[data-perf-analytics-inline]";
        Array.prototype.slice.call(
            document.querySelectorAll(selector)
        ).forEach(function (node) {
            var source = node.getAttribute(
                "data-perf-analytics-src"
            );
            if (source) {
                var external = document.createElement("script");
                external.async = true;
                external.src = source;
                external.setAttribute(
                    "data-perf-analytics-loaded",
                    "immediate-async-v4"
                );
                node.parentNode.insertBefore(external, node);
                node.parentNode.removeChild(node);
                return;
            }
            executeInline(node);
        });
    }

    flushAnalytics();
    window.__abrandFunctionalReady = false;
    window.__abrandAnalyticsDelay = "immediate-async-v4";
    window.__abrandFlushAnalytics = flushAnalytics;
})();
