
function ColorDetector (image) {
    this.color = { r:0, g:0, b:0 };
    this.image = image;
}

ColorDetector.prototype.componentToHex = function(c) {
    var hex = Math.max(Math.min(c, 255),0).toString(16);
    return hex.length == 1 ? '0' + hex : hex;
};

ColorDetector.prototype.getHexColor = function(offset) {
    var self = this;
    if(!offset) {
        offset = {r:0,g:0,b:0};
    }
    return "#" 
        + self.componentToHex(self.color.r + offset.r)
        + self.componentToHex(self.color.g + offset.g)
        + self.componentToHex(self.color.b + offset.b);
};

ColorDetector.prototype.detect = function() {
    var self = this;
    var blockSize = 5,
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        rgb = {r:0,g:0,b:0},
        length,
        count = 0;
    if(!context) {
        return self.color;
    }

    height = canvas.height = self.image.naturalHeight || self.image.offsetHeight || self.image.height;
    width = canvas.width = self.image.naturalWidth || self.image.offsetWidth || self.image.width;

    context.drawImage(self.image, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        return self.color;
    }

    length = data.data.length;

    while ( ( i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    self.color.r = ~~(rgb.r/count);
    self.color.g = ~~(rgb.g/count);
    self.color.b = ~~(rgb.b/count);

    return self.color;
}

function PleromaCat(handle) {
    this.handle = handle;
    this.colors = {
        backgroundColor: '#000000',
        borderColor: '#000000'
    };
    this.config = {
        'nya': {
            enabled: true,
            matcher: /(^|\s|>)な+(\s|<|$)/g,
            replacer: {
                source: /な/g,
                dest: 'にゃ'
            },
        }
    }
}

PleromaCat.prototype.getClassName = function() {
    var self = this;
    return 'USER____' + self.handle.replace(/@/g,'_AT_').replace(/\./g,'_');
};

PleromaCat.prototype.makeCat = function() {
    var self = this;
    var posts = document.getElementsByClassName(
        self.getClassName()
    );

    self.makeCatByClassName('user-info');
    self.makeCatByClassName('basic-user-card');

    for(var currentPost of posts) {
        self.makeCatByElement(currentPost);
        self.nyaByPost(currentPost);
    }
};

PleromaCat.prototype.makeCatByClassName = function(className) {
    var self = this;
    if(!className) {
        className = 'user-info';
    }
    var userinfos = document.getElementsByClassName(className);
    for(var infoIndex in userinfos) {
        if(userinfos[infoIndex].getElementsByClassName && !/cat$/.test(userinfos[infoIndex].innerText)) {
            var handle = userinfos[infoIndex].getElementsByClassName('handle');
            var regexHandle = new RegExp(self.handle, 'i');
            if(handle.length > 0) {
                if(regexHandle.test(handle[0].innerText)) {
                    self.makeCatByElement(userinfos[infoIndex]);
                }
            } else {
                handle = userinfos[infoIndex].getElementsByClassName('basic-user-card-screen-name');
                if(handle.length > 0) {
                    if(regexHandle.test(handle[0].innerText)) {
                        self.makeCatByElement(userinfos[infoIndex]);
                    }
                }
            }
        }
    }
}

PleromaCat.prototype.makeCatByElement = function(element) {
    var self = this;
    if(element.getElementsByClassName) {
        if(!/cat$/.test(element.className)) {
            element.className += ' cat';
        }
        var avatars = element.getElementsByClassName('avatar');
        for(var avatarIndex in avatars) {
            var currentAvatar = avatars[avatarIndex];
            if(currentAvatar.style) {
                if(self.colors.borderColor == '#000000') {
                    self.detectColors(currentAvatar);
                }
                currentAvatar.style.backgroundColor = self.colors.backgroundColor;
                currentAvatar.style.borderColor = self.colors.borderColor;
            }
        }
    }
};

PleromaCat.prototype.nyaByPost = function(element) {
    var self = this;
    if(element.getElementsByClassName && self.config.nya.enabled) {
        var contents = element.getElementsByClassName('status-content');
        for(var content of contents) {
            var matches = [...content.innerHTML.matchAll(self.config.nya.matcher)];
            for(var match of matches) {
                var source = match[0];
                var dest = source.replace(
                    self.config.nya.replacer.source, 
                    self.config.nya.replacer.dest
                );
                content.innerHTML = content.innerHTML.replace(source, dest);
            }
        }
    }
};

PleromaCat.prototype.detectColors = function(avatarElement) {
    var self = this;
    var images = avatarElement.getElementsByTagName('img');
    for(var imageIndex in images) {
        var detector = new ColorDetector(images[imageIndex]);
        detector.detect();
        self.colors.backgroundColor = detector.getHexColor();
        self.colors.borderColor = detector.getHexColor({r:-40,g:-40,b:-40});
        return;
    }
}

function PleromaModCatify() {
    this.cats = {};
    this.config = {
        'stylesheet': '/instance/pleroma-mods/pleroma-mod-catify.css',
        'triggers': {
            'displayName': [
                '🐱',
                '😺',
                '🐈',
                '😼',
                '😹',
                'にゃ',
                'cat',
                'mew',
                'meow',
                'nya',
                'miaou',
                'kitten',
                'kitn',
                'ktn'
            ],
            'instances': [
                'misskey.io',
                'waifu@pikachu.rocks',
                'Ocean22@niu.moe',
                'Ocean@pleroma.soykaf.com'
            ]
        },
        'observer': {
            'classes': [
                'timeline',
                'panel-body',
                'main',
                'active',
                'status-body'
            ],
            'config': {
                subtree: true,
                childList: true
            }
        },
        'interval': 1000
    };

    var stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', this.config.stylesheet);
    document.getElementsByTagName('head')[0].appendChild(stylesheet);
}

PleromaModCatify.prototype.run = function () {
    var self = this;

    window.setTimeout(function() {

        self.areYouACat();
        self.detectCats();
        self.catify();

        if(MutationObserver) {
            var mainContainer = document.getElementsByClassName('main')[0];
            var notificationContainer = document.getElementsByClassName('notifications')[0];
            var observer = new MutationObserver(function(mutations, observer) {
                var regex = new RegExp(self.config.observer.classes.join('|'));
                for(var mutation of mutations) {
                    if(
                        regex.test(mutation.target.className)
                    ) {
                        self.detectCats();
                        self.catify();
                    }
                }
            });

            observer.observe(mainContainer, self.config.observer.config);
            observer.observe(notificationContainer, self.config.observer.config);
        }

    }, self.config.interval * 5);

    if(!MutationObserver) {
        window.setInterval(function() {
            self.detectCats();
            self.catify();
        }, self.config.interval);
    }
};

PleromaModCatify.prototype.addCat = function(handle) {
    var self = this;
    handle = handle.trim();
    if(!self.cats.hasOwnProperty(handle)) {
        self.cats[handle] = new PleromaCat(handle);
    }
};

PleromaModCatify.prototype.areYouACat = function() {
    var self = this;
    var profile = document.getElementsByClassName('name-and-screen-name');
    var pattern = self.config.triggers.displayName.join('|');
    var regex = new RegExp(pattern, 'i');
    if(profile.length > 0) {
        var username = profile[0].getElementsByClassName('user-name');
        if(username.length > 0) {
            if(regex.test(username[0].innerText)) {
                var accountName = profile[0].getElementsByClassName('handle');
                if(accountName.length > 0) {
                    self.addCat(accountName[0].innerText.substring(1), true);
                }
            }
        }
    }
};

PleromaModCatify.prototype.detectCats = function() {
    var self = this;
    var nameAndAccountNames = document.getElementsByClassName('name-and-account-name');
    var regexName = new RegExp(self.config.triggers.displayName.join('|'),'i');
    var regexInstance = new RegExp(self.config.triggers.instances.join('|'),'i');
    for(var accIndex in nameAndAccountNames) {
        var currentAccount = nameAndAccountNames[accIndex];
        if(currentAccount.getElementsByClassName) {
            var isCat = false;
            var username = currentAccount.getElementsByClassName('user-name');
            if(username.length > 0) {
                isCat = regexName.test(username[0].innerText);
            }
            var account = currentAccount.getElementsByClassName('account-name');
            if(account.length > 0) {
                var handle = account[0].innerText;
                isCat = isCat || regexInstance.test(handle);
                if(isCat) {
                    self.addCat(handle);
                }
            }
        }
    }
};

PleromaModCatify.prototype.catify = function() {
    var self = this;
    for(var catIndex in self.cats) {
        self.cats[catIndex].makeCat();
    }
};


export default function() {
    var catify = new PleromaModCatify();
    catify.run();
    return catify;
}
