import { WizardContext } from 'telegraf/typings/scenes';

export class ExtendWizard {
  protected async leave(ctx: WizardContext) {
    const sceneName = ctx.scene.current.id;
    await ctx.scene.leave();
    console.log('Scene leave => '.yellow, sceneName);
  }
}
