import { logger } from './logger.js';
import { HelpersSettingsConfig } from './modules/config-app.js';

const NAME = "dnd5e-helpers";
const PATH = `/modules/${NAME}`;

export class MODULE{
  static async register(){
    logger.info("Initializing Module");
    MODULE.settings();
  }

  static async build(){
    try{
      MODULE.data = await (await fetch(`${PATH}/module.json`)).json() ?? {};
    }catch(err){
      logger.debug(`Error getting Module ${PATH} data`, err);
    }
    MODULE.data.path = PATH;
    logger.info("Module Data Built");
  }

  static setting(key){
    return game.settings.get(MODULE.data.name, key);
  }

  static localize(...args){
    return game.i18n.localize(...args);
  }

  static format(...args){
    return game.i18n.format(...args);
  }

  static sanitizeActorName(actor, feature, label){
    return ((MODULE.setting(feature) && actor.data.type === "npc") ? MODULE.format(label) : actor.data.name).capitalize();
  }

  static sanitizeTokenName(token, feature, label){
    return ((MODULE.setting(feature) && token.actor.data.type === "npc") ? MODULE.format(label) : token.data.name).capitalize();
  }

  static applySettings(settingsData){
    Object.entries(settingsData).forEach(([key, data])=> {
      game.settings.register(
        MODULE.data.name, key, {
          name : MODULE.localize(`setting.${key}.name`),
          hint : MODULE.localize(`setting.${key}.hint`),
          ...data
        }
      );
    });
  }

  static stringToDom(innerHTML, className){
    let dom = document.createElement("div");
    dom.innerHTML = innerHTML;
    dom.className = className;
    return dom;
  }

  static settings(){
    game.settings.registerMenu(MODULE.data.name, "helperOptions", {
      name : MODULE.format("setting.ConfigOption.name"),
      label : MODULE.format("setting.ConfigOption.label"),
      icon : "fas fa-user-cog",
      type : HelpersSettingsConfig,
      restricted : true,
    })
  }
}