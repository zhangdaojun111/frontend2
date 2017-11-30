import 'jquery-ui/ui/widgets/dialog';
import {PMAPI,PMENUM} from './postmsg';

$.widget("custom.erdsDialog", $.ui.dialog, {
    options: {
        closeText: "关闭",
        classes:{'ui-dialog':'ui-dialog-shadow'}
    },
    open: function () {
        this._super();
        if (this.options.defaultMax === true) {
            this._maximizeWindow();
        }
        if (this.options.customSize === true) {
            this._customWindow();
        }
        if (this.options.closable === false) {
            this.uiDialogTitlebarClose.hide();
            if (this.uiDialogTitlebarFull) {
                this.uiDialogTitlebarFull.css({
                    right: '0.3em'
                });
            }
        }
        return this;
    },

    _customWindow: function () {
        this._removeClass($(this.uiDialog[0]), "ui-dialog-maximize");
        let width = Math.max(400, document.documentElement.clientWidth);
        let height = Math.max(400, document.documentElement.clientHeight - 180);
        this.option('width', width);
        this.option('height', height);
        this.option('position', {my: "center", at: "center", of: window});
        this.fullScreen = false;
        if (this.uiDialogTitlebarFull) {
            this._removeClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-newwin");
            this._addClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-maximize");
            $(this.uiDialogTitlebarFull[0].firstChild).attr('title','全屏');
        }
    },

    _maximizeWindow: function () {
        let width = Math.max(400, document.documentElement.clientWidth);
        let height = Math.max(400, document.documentElement.clientHeight);
        this.options.originHeight = this.options.height;
        this.options.originWidth = this.options.width;
        this.option('width', width);
        this.option('height', height);
        this.option('position', {my: "center top", at: "center top", of: window});
        this.fullScreen = true;
        this.options.resizeMax && this.options.resizeMax();

        if (this.uiDialogTitlebarFull) {
            this._removeClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-maximize");
            this._addClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-newwin");
            $(this.uiDialogTitlebarFull[0].firstChild).attr('title','还原');
            this._addClass($(this.uiDialog[0]), "ui-dialog-maximize");
        }
    },
    _minimizeWindow: function () {
        this._removeClass($(this.uiDialog[0]), "ui-dialog-maximize");
        this.option('width', this.options.originWidth);
        this.option('height', this.options.originHeight);
        this.option('position', {my: "center", at: "center", of: window});
        this.fullScreen = false;
        this.options.resizeMin && this.options.resizeMin();

        if (this.uiDialogTitlebarFull) {
            this._removeClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-newwin");
            this._addClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-maximize");
            $(this.uiDialogTitlebarFull[0].firstChild).attr('title','全屏');
        }
    },
    _createTitlebar: function () {
        this._super();
        if (this.options.maxable === true) {
            this.uiDialogTitlebarFull = $("<button type='button' title='全屏'></button>")
                .button({
                    label: '',
                    icon: "icon-maximize",
                    showLabel: false
                })
                .appendTo(this.uiDialogTitlebar);
            this._addClass(this.uiDialogTitlebarFull, "ui-dialog-titlebar-full");
            this._on(this.uiDialogTitlebarFull, {
                click: function (event) {
                    event.preventDefault();
                    if (this.fullScreen === true) {
                        this._minimizeWindow();
                    } else {
                        this._maximizeWindow();
                    }
                }
            });
            this._on('.ui-dialog-titlebar-close', {
                click: function (event) {
                    event.preventDefault();

                    if(window.top.miniFormVal){
                        window.top.hideMiniForm[window.top.miniFormValTableId]();
                        delete window.top.miniFormVal[window.top.miniFormValTableId ];
                    }

                }
            });
        }
    },
});



