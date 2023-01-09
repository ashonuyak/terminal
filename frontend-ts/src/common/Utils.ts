export default class Utils {
  static splitStringAtIndex(value, index) {
    if (!value) {
      return ['', ''];
    }
    return [value.substring(0, index), value.substring(index)];
  }
}
