export default class Ui {
  static createButton(label, target = null) {
    const button = jQuery("#template_button").clone();
    button.removeAttr("id");
    button.text(label);
    if (target) {
      target.append(button);
    }
    return button;
  }
}
