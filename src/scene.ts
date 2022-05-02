import type { Entity as EntityNewECSType } from '@dcl/ecs/dist/engine/entity'
import { EngineNewECSType } from './new-ecs'

/**
 * @param periodSeconds - complete period in seconds
 * @param update - the function to call when update
 * @returns Function system with the logic implemented to call p/2 the update, and
 *  not to call the other p/2
 */
function halfCycleUpdateSystem(
  periodSeconds: number,
  update: (dt: number) => void
) {
  let updating = true
  let t = 0.0

  return (dt: number) => {
    t += dt

    if (t % periodSeconds < periodSeconds / 2) {
      if (!updating) {
        log('updating....')
        updating = true
      }
    } else {
      if (updating) {
        log('stop updating....')
        updating = false
      }
    }

    if (updating) {
      update(dt)
    }
  }
}

function circularSystem(newEngine: EngineNewECSType) {
  let t = 0.0
  const sdk = newEngine.baseComponents
  return (dt: number) => {
    t += 2 * Math.PI * dt

    const group = newEngine.groupOf(sdk.BoxShape)
    for (const [entity] of group) {
      const transform = sdk.Transform.mutable(entity)
      if (transform) {
        transform.position.x = 8 + 2 * Math.cos(t)
        transform.position.z = 8 + 2 * Math.sin(t)
      }
    }
  }
}

function createCube(
  x: number,
  y: number,
  z: number,
  newEngine: EngineNewECSType
): EntityNewECSType {
  const sdk = newEngine.baseComponents
  const myEntity = newEngine.addEntity()

  sdk.Transform.create(myEntity, {
    position: { x, y, z },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0, w: 1 }
  })

  sdk.BoxShape.create(myEntity, {
    withCollisions: true,
    isPointerBlocker: true,
    visible: true,
    uvs: []
  })

  return myEntity
}

export function setup(newEngine: EngineNewECSType) {
  createCube(8, 2, 8, newEngine)

  // Systems
  const completeCyclePeriodSeconds = 10
  const mySystem = halfCycleUpdateSystem(
    completeCyclePeriodSeconds,
    circularSystem(newEngine)
  )
  newEngine.addSystem(mySystem)
  // newEngine.addSystem(rotatorSystem(newEngine))
}
