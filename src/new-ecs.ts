import { Engine as createNewEngine } from '@dcl/ecs'
import { sendToRenderer } from '@decentraland/ExperimentalAPI'
import { base64EncArr } from './base64'

export type EngineNewECSType = ReturnType<typeof createNewEngine>

export function init() {
  class NewECSSystem implements ISystem {
    constructor(public newEcsEngine: EngineNewECSType) {}
    update(dt: number) {
      this.newEcsEngine.update(dt)
    }
  }

  const newEngine = createNewEngine({
    send: (data: Uint8Array) => {
      sendToRenderer(base64EncArr(data))
        .then()
        .catch((err) => log(err))
    },
    onData: (_cb: (data: Uint8Array) => void) => {
      log('should be call cb if I receive data from renderer or other places')
    }
  })

  const system = new NewECSSystem(newEngine)
  engine.addSystem(system)
  return newEngine
}
