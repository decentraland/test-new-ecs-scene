import { EngineNewECSType } from './new-ecs'

export function setup(newEngine: EngineNewECSType) {
  const sdk = newEngine.baseComponents
  const myEntity = newEngine.addEntity()

  sdk.Transform.create(myEntity, {
    position: { x: 1, y: 2, z: 3 },
    scale: { x: 1, y: 2, z: 3 },
    rotation: { x: 1, y: 2, z: 3, w: Math.PI }
  })

  let t = 0.0
  let updating = true
  newEngine.addSystem((dt: number) => {
    t += dt

    if (t % 10 < 5) {
      if (!updating) {
        log('updating....')
        updating = true
      }
      const group = newEngine.mutableGroupOf(sdk.Transform)
      for (const [_entity, component] of group) {
        component.position.x = Math.cos(t)
      }
    } else {
      if (updating) {
        log('stop updating....')
        updating = false
      }
    }
  })
}
