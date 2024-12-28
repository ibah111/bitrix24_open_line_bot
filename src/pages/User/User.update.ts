import { Start, Update, Ctx } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { START_SCENE_ID } from 'src/app.constants';
export const HELLO_SCENE_ID = 'HELLO_SCENE_ID';
@Update()
export class UserUpdate {
  constructor() {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    //покидает текущий контекст сцену
    await ctx.scene.leave();
    //откатывается к стартовой сцене
    await ctx.scene.enter(START_SCENE_ID);
  }
}
