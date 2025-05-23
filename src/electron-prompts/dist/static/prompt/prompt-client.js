var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => {
    "use strict";
    const e = { inputHTMLType: { onChangeAndKeyup: ["number", "date", "datetime-local", "time", "week", "month"], onChange: ["file", "radio", "checkbox", "range", "file", "color"], restrictedAttributes: ["id", "onchange", "onkeyup"] } }, t = new class {
        constructor() {
            this.adoptedPrompt = null;
            this.devMode = !1;
            this.formStateDefaults = {};
            this.formState = {};
            this.init = () => __awaiter(this, void 0, void 0, function* () { const t = { ebox: document.querySelector(".epc-elembox") || document.getElementById("epc-elembox"), bbox: document.querySelector(".epc-buttonbox") || document.getElementById("epc-buttonbox"), titleText: document.querySelector(".epc-titletext") || document.getElementById("epc-titletext") }; if (this.adoptedPrompt = yield window.electronAPI.adopt(), this.adoptedPrompt) {
                this.adoptedPrompt.devMode && (this.devMode = !0), this.logs.log(this.adoptedPrompt, this.adoptedPrompt.windowTitle), t.titleText.innerHTML = this.adoptedPrompt.windowTitle, document.title = this.adoptedPrompt.windowTitle, this.adoptedPrompt.elements.forEach((o => { switch (o.type) {
                    case "header":
                        (a = t.ebox.appendChild(document.createElement("h4"))).innerHTML = o.value, o.classes && o.classes.forEach((e => { a.classList.add(e); }));
                        break;
                    case "paragraph":
                        (a = t.ebox.appendChild(document.createElement("p"))).innerHTML = o.value, o.classes && o.classes.forEach((e => { a.classList.add(e); }));
                        break;
                    case "input":
                        var a = t.ebox.appendChild(document.createElement("input")), s = ["keyup"];
                        this.formStateDefaults[o.name] = void 0 === o.value ? "" : o.value, console.log(o), "attributes" in o && ("type" in o.attributes && e.inputHTMLType.onChange.includes(o.attributes.type) && (s = ["change"]), "type" in o.attributes && e.inputHTMLType.onChangeAndKeyup.includes(o.attributes.type) && s.push("change"), Object.keys(o.attributes).forEach((t => { e.inputHTMLType.restrictedAttributes.includes(t) || (!0 === o.attributes[t] ? a.setAttribute(t, "") : a.setAttribute(t, o.attributes[t])); }))), "classes" in o && o.classes.forEach((e => { a.classList.add(e); })), "placeholder" in o && a.setAttribute("placeholder", o.placeholder), "value" in o && (a.value = o.value), a.setAttribute("id", `form-${o.name}`), s.forEach((e => { "attributes" in o && "type" in o.attributes && "file" == o.attributes.type ? a.addEventListener(e, this.updateFormStateFile(o.name)) : a.addEventListener(e, this.updateFormState(o.name)); }));
                        break;
                    case "select":
                        if (a = t.ebox.appendChild(document.createElement("select")), o.classes && o.classes.forEach((e => { a.classList.add(e); })), console.log(o), o.options && Array.isArray(o.options)) {
                            var n = this.utils.select.findDefault(o.options);
                            this.formStateDefaults[o.name] = o.options[n].value;
                            var i = 0;
                            o.options.forEach((e => { if (e.value) {
                                var t = a.appendChild(document.createElement("option"));
                                t.setAttribute("value", e.value), t.innerHTML = e.text || e.value, console.log(i, n), i == n && (t.selected = !0);
                            } i++; }));
                        }
                        a.setAttribute("id", `form-${o.name}`), a.addEventListener("change", this.updateFormState(o.name));
                } })), yield window.electronAPI.sizeUp(this.adoptedPrompt.uuid, t.ebox.scrollHeight), console.log(this.formStateDefaults);
                var o = t.bbox.appendChild(document.createElement("button"));
                o.addEventListener("click", this.handleCancelButton(this.adoptedPrompt.uuid)), this.adoptedPrompt.cancelButton ? (this.adoptedPrompt.cancelButton.classes && this.adoptedPrompt.cancelButton.classes.forEach((e => { o.classList.add(e); })), o.innerHTML = this.adoptedPrompt.cancelButton.value ? this.adoptedPrompt.cancelButton.value : "Cancel") : o.innerHTML = "Cancel", window.addEventListener("keypress", ((e) => __awaiter(this, void 0, void 0, function* () { "Enter" === e.key && (e.preventDefault(), yield this.handleButtonClick(this.adoptedPrompt.uuid, "_enter")()); }))), this.adoptedPrompt.buttons.forEach((e => { var o = t.bbox.appendChild(document.createElement("button")); o.addEventListener("click", this.handleButtonClick(this.adoptedPrompt.uuid, e.name)), e.classes && e.classes.forEach((e => { o.classList.add(e); })), o.innerHTML = e.value; }));
            }
            else
                this.logs.log("No prompt to adopt! Need to close..."); });
            this.utils = { select: { findDefault: e => { var t = 0, o = 0; return e.forEach((e => { "selected" in e && (t = o), o++; })), t; } } };
            this.logs = { log: (...e) => { this.devMode && console.log(...e); }, error: (...e) => { this.devMode && console.error(...e); } };
            this.handleButtonClick = (e, t) => (o) => __awaiter(this, void 0, void 0, function* () { this.logs.log(e, t); var a = { button: t }; Object.keys(this.formState).length > 0 && (a.values = this.formState), yield window.electronAPI.formDone(e, a), window.close(); });
            this.handleCancel = () => __awaiter(this, void 0, void 0, function* () { yield window.electronAPI.cancel(this.adoptedPrompt.uuid), this.logs.log("cancel time!"); });
            this.handleCancelButton = () => () => __awaiter(this, void 0, void 0, function* () { yield this.handleCancel(), window.close(); });
            this.updateFormState = e => t => { const o = document.getElementById(`form-${e}`).value; this.logs.log(e, o), o == this.formStateDefaults[e] ? e in this.formState && delete this.formState[e] : this.formState[e] = o, this.logs.log(this.formState); };
            this.updateFormStateFile = e => t => { var o = [], a = document.getElementById(`form-${e}`).files; console.log(a), console.log(a.length); for (var s = 0; s < a.length; s++)
                console.log("found a file"), o.push({ name: a[s].name, path: a[s].path, size: a[s].size, lastModified: a[s].lastModified }); this.logs.log(e, o), 0 == o.length ? e in this.formState && delete this.formState[e] : this.formState[e] = o, this.logs.log(this.formState); };
        }
    };
    window.addEventListener("load", (() => __awaiter(void 0, void 0, void 0, function* () { yield t.init(); })));
})();
export {};
