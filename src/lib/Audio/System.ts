

export class SystemStatement {
  code: string;
  title: string;
  constructor(code: string, title: string) {
    this.code = code;
    this.title = title;
  }
}

export const SYSTEM_STATEMENTS: { [code: string]: SystemStatement } = {
  STARTUP: new SystemStatement('STARTUP', 'Система загружена и готова к работе'),
  KEYBOARD_CONNECTED: new SystemStatement('KEYBOARD_CONNECTED', 'Клавиатура подключена'),
  START_FETCH: new SystemStatement('START_FETCH', 'Загрузка файлов начата'),
  FINISH_FETCH: new SystemStatement('FINISH_FETCH', 'Загрузка файлов завершена'),
}