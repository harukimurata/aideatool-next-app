/**
 * string型のチェック
 * @param data
 * @returns
 */
export function IsString(data: string | null) {
  if (!data) {
    return true;
  }
  return typeof data === "string";
}

/**
 * number型のチェック
 * @param data
 * @returns
 */
export function IsNumber(data: number) {
  return typeof data === "number";
}

/**
 * stringでnumber型のチェック
 * @param data
 * @returns
 */
export function IsStringNumber(data: any) {
  var regex = /[a-zA-Z]/;
  return regex.test(data);
}

/**
 * number型の最小値チェック
 * @param data
 * @param min
 * @returns
 */
export function IsMin(data: number, min: number) {
  return data >= min;
}

/**
 * number型の最大値チェック
 * @param data
 * @param max
 * @returns
 */
export function IsMax(data: number, max: number) {
  return data <= max;
}

/**
 * string型の最小文字数チェック
 * @param data
 * @param min
 * @returns
 */
export function IsMinLength(data: string | null, min: number) {
  if (!data) {
    return true;
  }
  const length = data.length;
  return length >= min;
}

/**
 * string型の最大文字数チェック
 * @param data
 * @param max
 * @returns
 */
export function IsMaxLength(data: string | null, max: number) {
  if (!data) {
    return true;
  }
  const length = data.length;
  return length <= max;
}

/**
 * string array型のチェック
 * @param data
 * @returns
 */
export function IsStringArray(data: string[]): data is string[] {
  return data.every((item) => typeof item === "string");
}

/**
 * number array型のチェック
 * @param data
 * @returns
 */
export function IsNumberArray(data: number[]): data is number[] {
  return data.every((item) => typeof item === "number");
}

//型のチェック
export function IsOriginalType<T>(data: T): T {
  return data;
}
