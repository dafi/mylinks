export interface Theme {
  backgroundImage?: string;
  missingFavIconColor: string,
  linkDescriptionBackground?: string;
  linkDescriptionColor?: string;
}

export interface Link {
  id?: string;
  label: string;
  url: string;
  favicon?: string;
  description?: string;
}
export interface Shortcut {
  key: string;
  id: string;
}

export interface Widget {
  id: string;
  title: string;
  list: [Link];
}

export interface MyLinks {
  theme: Theme;
  columns: [Widget[]];
  shortcuts?: Shortcut[];
}

export function openAllLinks(wd: Widget) {
  wd.list.reverse().forEach(item => window.open(item.url));
}

export class MyLinksHolder {

  constructor(public readonly myLinks: MyLinks) {
    this.updateDescriptionsFromShortcuts();
  }

  updateDescriptionsFromShortcuts() {
    const shortcuts = this.myLinks.shortcuts;

    if (!shortcuts) {
      return;
    }
    this.myLinks.columns.forEach(row => {
      row.forEach(widgets => {
        widgets.list
        .filter(item => !!item.id)
        .forEach(item => {
          item.description = shortcuts.find(s => s.id === item.id)?.key
        });
      })
    });
  }

  findWidgetById(id: string) {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  findLinkByKey(key: string): Link | undefined {
    const shortcut = this.myLinks.shortcuts?.find((shortcut) => shortcut.key === key);
    if (!shortcut) {
      return undefined;
    }
    return this.myLinks.columns.flat().map(i => i.list).flat().find(item => item.id === shortcut.id);
  }

  hasShortcuts(): boolean {
    return (this.myLinks.shortcuts?.length || 0) > 0;
  }

  applyBackground() {
    const bkg = this.myLinks.theme?.backgroundImage;
    const body = document.body;
    if (bkg) {
      body.style.backgroundImage = `url(${bkg})`;
    } else {
      body.style.backgroundImage = '';
    }
  }

  applyTheme() {
    const theme = this.myLinks.theme;

    if (!theme) {
      return;
    }

    if (theme.missingFavIconColor) {
      document.documentElement.style.setProperty('--missing-favicon-color', theme.missingFavIconColor);
    }
    if (theme.linkDescriptionBackground) {
      document.documentElement.style.setProperty('--link-description-background', theme.linkDescriptionBackground);
    }
    if (theme.linkDescriptionColor) {
      document.documentElement.style.setProperty('--link-description-color', theme.linkDescriptionColor);
    }
  }
}
