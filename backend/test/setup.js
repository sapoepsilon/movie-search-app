import { expect as viExpect } from 'vitest'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

global.expect = expect