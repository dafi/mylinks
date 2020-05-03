export interface Theme {
  backgroundImage?: string;
  missingFavIconColor: string,
  linkKeyBackground?: string;
  linkKeyColor?: string;
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

  findLinkByShortcut(shortcut: Shortcut): Link | undefined {
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

    this.setColor('--missing-favicon-color', theme.missingFavIconColor);
    this.setColor('--link-key-background', theme.linkKeyBackground);
    this.setColor('--link-key-color', theme.linkKeyColor);
  }

  private setColor(property: string, color?: string) {
    if (color) {
      document.documentElement.style.setProperty(property, color);
    } else {
      document.documentElement.style.removeProperty(property);
    }
  }
}
