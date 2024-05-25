import {
    getDataSubSkill,
} from "./common.mjs";

export const RegisterHandlebars = function () {
    Handlebars.registerHelper('translate', function(where, tra) {
        try {
            let translation = CONFIG.MM3;
            const levels = where.split(".");
            for(let i = 0; i < levels.length; i++) {
            translation = translation[levels[i]];
            }
            return game.i18n.localize(translation[tra]);

        } catch (error) {
            console.error(`Error translating ${tra} in ${where}: ${error}`);
            return "";
        }
    });

    Handlebars.registerHelper('singularOrPlural', function(count, successOrFail) {
        let result = "";

        if(count > 1) {
            if(successOrFail === 'success') result = game.i18n.localize("MM3.ROLL.DegresReussite");
            else  result = game.i18n.localize("MM3.ROLL.DegresEchec");
        } else {
            if(successOrFail === 'success') result = game.i18n.localize("MM3.ROLL.DegreReussite");
            else  result = game.i18n.localize("MM3.ROLL.DegreEchec");
        }

        return result;
    });

    Handlebars.registerHelper('mm3concat', function(base, id, last) {
    return `${base}.${id}.${last}`;
    });

    Handlebars.registerHelper('isHigherThan', function(base, compare) {
    return base > compare ? true : false;
    });

    Handlebars.registerHelper('isHigherOrEqual', function(base, compare) {
    return base >= compare ? true : false;
    });

    Handlebars.registerHelper('marge', function(base, toSubstract) {
    return Math.floor((base - toSubstract) / 5);
    });

    Handlebars.registerHelper('isValue', function(base, compare) {
    return base === compare ? true : false;
    });

    Handlebars.registerHelper('isNotValue', function(base, compare) {
    return base !== compare ? true : false;
    });

    Handlebars.registerHelper('hasLinkAndAlt', function(id, actor) {
    let links = actor?.pwrLink?.[id]?.length ?? 0;
    links += actor?.pwrAlternatif?.[id]?.length ?? 0;
    links += actor?.pwrDynamique?.[id]?.length ?? 0;

    return links > 0 ? true : false;
    });

    Handlebars.registerHelper('hasLink', function(id, actor) {
    let links = actor?.pwrLink?.[id]?.length ?? 0;

    return links > 0 ? true : false;
    });

    Handlebars.registerHelper('hasAlt', function(id, actor) {
    let links = actor?.pwrAlternatif?.[id]?.length ?? 0;
    links += actor?.pwrDynamique?.[id]?.length ?? 0;

    return links > 0 ? true : false;
    });

    Handlebars.registerHelper('hasSkillLink', function(root, what, id) {
        let getSkill = false;
        let result = true;

        if(id !== '' && what !== '' && id !== undefined && what !== undefined) getSkill = getDataSubSkill(root.actor, what, id);
        if(!getSkill) result = false;

        return result;
    });

    Handlebars.registerHelper('getAtt', function(root, what, id, data) {
        let result = getDataSubSkill(root.actor, what, id);
        if(!result) result = '';
        else result = result[data];

        return result;
    });

    Handlebars.registerHelper('getPwrAlt', function(root, folder, key) {
    return root.actor[folder][key];
    });

    Handlebars.registerHelper('getPwr', function(root, id, what) {
    const result = root.systemData?.pwr?.[id]?.cout?.[what] ?? 0;

    return result;
    });

    Handlebars.registerHelper('isOwner', function(data) {
    let result = false;

    if(game.user.isGM || (data.actor.isOwner && !data.actor.isLimited)) result = true;

    return result;
    });

    Handlebars.registerHelper('isTrusted', function() {
    let result = false;

    if(game.user.isGM || game.user.isTrusted) result = true;

    return result;
    });

    Handlebars.registerHelper('etatExist', function(Array, id) {
        let result = false;
        let array = Array ?? [];

        if(array.some(etat => etat.id === id)) result = true;

        return result;
    });

    Handlebars.registerHelper('isAfflictionDmg', function(attack) {
        let result = true;

        if((attack.isDmg && !attack.isAffliction) ||
          (!attack.isDmg && attack.isAffliction) ||
          (!attack.isDmg && !attack.isAffliction)) result = false;

        return result;
    });

    Handlebars.registerHelper('hasOptShift', function() {
        let result = false;

        if(game.settings.get("mutants-and-masterminds-3e", "dcroll") === 'shift') result = true;

        return result;
    });

    Handlebars.registerHelper('labelize', function(str) {
        const all = Object.assign({},
            CONFIG.MM3.listmods);

        return game.i18n.localize(all?.[str] ?? str);
    });

    Handlebars.registerHelper('getLast', function(str) {
        const split = str.split('.');
        const lastValue = split[split.length-2];

        return lastValue;
    });

    Handlebars.registerHelper('getLabelTranslate', function(str) {
        let split = str !== '' ? str.split('.') : '';
        if(str !== '') {
            split.pop();
            split.pop();
        }

        return str !== '' ? split.join('.') : '';
    });

    Handlebars.registerHelper('getVarianteName', function(system, name) {
        return system?.listEffectsVariantes?.[name] ?? '';
    });

    Handlebars.registerHelper('ObjectIsEmpty', function(object) {
        return foundry.utils.isEmpty(object);
    });

    Handlebars.registerHelper('translateStatues', function(str) {
        let result = str.charAt(0).toUpperCase() + str.slice(1);

        if(!result.includes('MM3')) {
            switch(result) {
                case 'Impaired':
                    result = `MM3.STATUS.Decreased`;
                    break;

                case 'Fatigued':
                    result = `MM3.STATUS.Tired`;
                    break;

                case 'Immobile':
                    result = `MM3.STATUS.Stuck`;
                    break;

                case 'Unaware':
                    result = `MM3.STATUS.Insensitive`;
                    break;

                case 'Debilitated':
                    result = `MM3.STATUS.Invalid`;
                    break;

                case 'Vulnerable':
                    result = `MM3.STATUS.Vulnerability`;
                    break;

                case 'Staggered':
                    result = `MM3.STATUS.Chanceling`;
                    break;

                case 'Entranced':
                    result = `MM3.STATUS.Enthralled`;
                    break;

                case 'Compelled':
                    result = `MM3.STATUS.Influenced`;
                    break;

                case 'Bound':
                    result = `MM3.STATUS.Tied`;
                    break;

                case 'Incapacitated':
                    result = `MM3.STATUS.Neutralized`;
                    break;

                case 'Weakened':
                    result = `MM3.STATUS.Downgrade`;
                    break;

                case 'Paralyzed':
                    result = `MM3.STATUS.Paralysis`;
                    break;

                default:
                    result = `MM3.STATUS.${result}`;
                    break;

            }
        }

        return game.i18n.localize(result);
    });
}