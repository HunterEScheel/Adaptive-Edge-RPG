import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  combatSkillLevel,
  ensureCombatSkills,
  equippedArmorEvasionReduction,
  evasion,
  normalizeCurrentValues,
  restoreToMax,
  type Character,
} from '../system/character'
import { skillCost } from '../system/costs'
import { ATTRIBUTES } from '../system/attributes'
import { COMBAT_SKILLS, isCombatSkillId } from '../system/combatSkills'
import { MAGIC_MEDIUMS, MAGIC_SCHOOLS } from '../system/magicSchools'
import { TETHER_TIERS } from '../system/tethers'
import { FLAW_SEVERITIES } from '../system/flaws'
import { getCharacter, updateCharacter } from '../lib/characters'
import { supabaseConfigured } from '../lib/supabase'
import { InventoryEditor } from '../components/InventoryEditor'
import { QuickCast } from '../components/QuickCast'
import { SavedSpells } from '../components/SavedSpells'
import { TakeDamagePanel } from '../components/TakeDamagePanel'
import { DeathSavePanel } from '../components/DeathSavePanel'

type Tab = 'general' | 'combat' | 'spellcasting'

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'combat', label: 'Combat' },
  { key: 'spellcasting', label: 'Spellcasting' },
]

const ATTRIBUTE_ABBR: Record<(typeof ATTRIBUTES)[number], string> = {
  Power: 'POW',
  Agility: 'AGI',
  Intelligence: 'INT',
  Sense: 'SEN',
  Influence: 'INF',
}

export function Sheet() {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [tab, setTab] = useState<Tab>('combat')
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>(
    'idle',
  )
  const saveTimer = useRef<number | null>(null)
  const skipNextSave = useRef(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getCharacter(id).then((row) => {
      if (cancelled) return
      if (row) setCharacter(ensureCombatSkills(row.data))
      else setMissing(true)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!character || !id) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    setSavingState('saving')
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(async () => {
      const ok = await updateCharacter(id, character)
      setSavingState(ok ? 'saved' : 'idle')
    }, 600)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [character, id])

  const { combatSkills, otherSkills } = useMemo(() => {
    if (!character) return { combatSkills: [], otherSkills: [] }
    const combatById = new Map(
      character.skills
        .filter((s) => isCombatSkillId(s.id))
        .map((s) => [s.id, s]),
    )
    const combat = COMBAT_SKILLS.map(
      (def) =>
        combatById.get(def.id) ?? { id: def.id, name: def.name, level: 0 },
    )
    const other = character.skills
      .filter((s) => !isCombatSkillId(s.id))
      .sort((a, b) => b.level - a.level)
    return { combatSkills: combat, otherSkills: other }
  }, [character])

  if (loading) return <p className="text-sm text-zinc-500">Loading…</p>
  if (missing || !character) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-zinc-500">Character not found.</p>
        <Link to="/" className="text-sm text-amber-300 hover:text-amber-200">
          ← Back to roster
        </Link>
      </div>
    )
  }

  const adjustHp = (delta: number) =>
    setCharacter((c) =>
      c ? normalizeCurrentValues({ ...c, currentHp: c.currentHp + delta }) : c,
    )
  const adjustEp = (delta: number) =>
    setCharacter((c) =>
      c ? normalizeCurrentValues({ ...c, currentEp: c.currentEp + delta }) : c,
    )
  const longRest = () => setCharacter((c) => (c ? restoreToMax(c) : c))
  const setGold = (gold: number) =>
    setCharacter((c) => (c ? { ...c, gold: Math.max(0, gold) } : c))
  const setInventory = (inventory: typeof character.inventory) =>
    setCharacter((c) => (c ? { ...c, inventory } : c))

  const hasMagic =
    Object.values(character.magicSchools).some((v) => v > 0) ||
    Object.values(character.magicMediums).some((v) => v > 0)

  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-zinc-100">
            {character.name}
          </h2>
          {(character.currentHp === 0 ||
            character.tethers.length > 0 ||
            character.flaws.length > 0) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {character.currentHp === 0 && (
                <span
                  title="At 0 HP — rolling death saves"
                  className="rounded px-2 py-0.5 text-xs bg-rose-900/60 text-rose-100 border border-rose-600 font-semibold uppercase tracking-wider"
                >
                  Down
                </span>
              )}
              {character.tethers.map((t) => {
                const tierLabel =
                  TETHER_TIERS.find((o) => o.tier === t.tier)?.label ??
                  `Tier ${t.tier}`
                return (
                  <span
                    key={t.id}
                    title={`Tether · ${tierLabel}`}
                    className="rounded px-2 py-0.5 text-xs bg-sky-900/40 text-sky-200 border border-sky-700/50"
                  >
                    {t.description || 'Untitled tether'}
                  </span>
                )
              })}
              {character.flaws.map((f) => {
                const sevLabel =
                  FLAW_SEVERITIES.find((o) => o.key === f.severity)?.label ??
                  f.severity
                return (
                  <span
                    key={f.id}
                    title={`Flaw · ${sevLabel}`}
                    className="rounded px-2 py-0.5 text-xs bg-rose-900/40 text-rose-200 border border-rose-700/50"
                  >
                    {f.description || 'Untitled flaw'}
                  </span>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>
            {savingState === 'saving'
              ? 'Saving…'
              : savingState === 'saved'
                ? 'Saved'
                : ''}
          </span>
          {id && (
            <Link
              to={`/builder/${id}`}
              className="rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-zinc-300"
            >
              Edit build
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <ResourcesCard
          character={character}
          onAdjustHp={adjustHp}
          onAdjustEp={adjustEp}
        />
        <DefenseCard character={character} />
      </div>

      <div className="grid grid-cols-5 gap-1">
        {ATTRIBUTES.map((a) => (
          <AttrPill
            key={a}
            label={ATTRIBUTE_ABBR[a]}
            value={character.attributes[a]}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wide text-zinc-500">
            Saves
          </span>
          <div className="flex items-center gap-1">
            <SaveBadge
              label="Dodge"
              value={combatSkillLevel(character, 'combat-dodge')}
            />
            <SaveBadge
              label="Grit"
              value={combatSkillLevel(character, 'combat-grit')}
            />
            <SaveBadge
              label="Resolve"
              value={combatSkillLevel(character, 'combat-resolve')}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={longRest}
          className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-sm font-medium text-zinc-950"
        >
          Long rest (restore HP & EP)
        </button>
      </div>

      <nav className="flex gap-1 border-b border-zinc-800">
        {TABS.map((t) => {
          const active = t.key === tab
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                'px-4 py-2 text-sm border-b-2 -mb-px transition ' +
                (active
                  ? 'border-amber-400 text-amber-200'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300')
              }
            >
              {t.label}
            </button>
          )
        })}
      </nav>

      {tab === 'combat' && (
        <CombatTab
          character={character}
          combatSkills={combatSkills}
          onTakeDamage={(next) =>
            setCharacter((c) => (c ? normalizeCurrentValues(next) : c))
          }
        />
      )}

      {tab === 'spellcasting' && (
        <div className="space-y-3">
          {hasMagic && (
            <>
              <div className="rounded border border-sky-800/60 bg-sky-900/20 px-3 py-2 text-xs text-sky-200 flex items-start gap-2">
                <span aria-hidden className="font-bold">ⓘ</span>
                <span>
                  Spells can be amped on the fly: every extra 5 EP spent casting
                  raises your hit bonus <em>or</em> save DC by 1.
                </span>
              </div>
              <ReadOnlySection title="Quick cast" collapsible defaultOpen={false}>
                <QuickCast
                  schools={character.magicSchools}
                  mediums={character.magicMediums}
                  currentEp={character.currentEp}
                  savedSpells={character.savedSpells ?? []}
                  onCast={(cost) =>
                    setCharacter((c) =>
                      c
                        ? normalizeCurrentValues({
                            ...c,
                            currentEp: c.currentEp - cost,
                          })
                        : c,
                    )
                  }
                  onSave={(spell) =>
                    setCharacter((c) =>
                      c
                        ? {
                            ...c,
                            savedSpells: [
                              ...(c.savedSpells ?? []),
                              {
                                id: crypto.randomUUID(),
                                ...spell,
                              },
                            ],
                          }
                        : c,
                    )
                  }
                />
              </ReadOnlySection>
              <ReadOnlySection title="Saved spells">
                <SavedSpells
                  schools={character.magicSchools}
                  mediums={character.magicMediums}
                  savedSpells={character.savedSpells ?? []}
                  currentEp={character.currentEp}
                  onCast={(cost) =>
                    setCharacter((c) =>
                      c
                        ? normalizeCurrentValues({
                            ...c,
                            currentEp: c.currentEp - cost,
                          })
                        : c,
                    )
                  }
                  onRemove={(id) =>
                    setCharacter((c) =>
                      c
                        ? {
                            ...c,
                            savedSpells: (c.savedSpells ?? []).filter(
                              (s) => s.id !== id,
                            ),
                          }
                        : c,
                    )
                  }
                />
              </ReadOnlySection>
            </>
          )}
          {hasMagic ? (
            <>
              {Object.values(character.magicSchools).some((v) => v > 0) && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs uppercase tracking-wide text-zinc-500 mr-1">
                    Schools
                  </span>
                  {MAGIC_SCHOOLS.filter(
                    (s) => character.magicSchools[s] > 0,
                  ).map((s) => (
                    <SaveBadge
                      key={s}
                      label={s}
                      value={character.magicSchools[s]}
                    />
                  ))}
                </div>
              )}
              {Object.values(character.magicMediums).some((v) => v > 0) && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs uppercase tracking-wide text-zinc-500 mr-1">
                    Mediums
                  </span>
                  {MAGIC_MEDIUMS.filter(
                    (m) => character.magicMediums[m] > 0,
                  ).map((m) => (
                    <SaveBadge
                      key={m}
                      label={m}
                      value={character.magicMediums[m]}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-500 italic">
              Non-magical character.
            </p>
          )}
        </div>
      )}

      {tab === 'general' && (
        <div className="space-y-3">
          <ReadOnlySection title="Gold">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={character.gold}
                onChange={(e) => setGold(Number(e.target.value) || 0)}
                className="w-32 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-amber-300 font-mono text-right"
              />
              <div className="flex gap-1">
                {[-10, -1, +1, +10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setGold(character.gold + d)}
                    className="rounded bg-zinc-800 hover:bg-zinc-700 px-2 py-1 text-xs font-mono"
                  >
                    {d > 0 ? `+${d}` : d}
                  </button>
                ))}
              </div>
            </div>
          </ReadOnlySection>

          <ReadOnlySection title="Inventory">
            <InventoryEditor
              value={character.inventory}
              onChange={setInventory}
            />
          </ReadOnlySection>

          <ReadOnlySection title="Skills">
            {otherSkills.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No other skills.</p>
            ) : (
              <SkillList skills={otherSkills} />
            )}
          </ReadOnlySection>

        </div>
      )}

      {!supabaseConfigured && (
        <div className="rounded border border-amber-700/50 bg-amber-900/20 p-3 text-xs text-amber-200">
          Supabase isn&apos;t configured — changes won&apos;t be saved.
        </div>
      )}
    </div>
  )
}

interface CombatTabProps {
  character: Character
  combatSkills: { id: string; name: string; level: number }[]
  onTakeDamage: (next: Character) => void
}

function CombatTab({
  character,
  combatSkills,
  onTakeDamage,
}: CombatTabProps) {
  const parryLv = combatSkillLevel(character, 'combat-parry')

  const skillByName = new Map(combatSkills.map((s) => [s.id, s]))
  const equippedByCategory = new Map<string, typeof character.inventory>()
  for (const item of character.inventory) {
    if (!item.equipped || !item.weaponCategory) continue
    const list = equippedByCategory.get(item.weaponCategory) ?? []
    list.push(item)
    equippedByCategory.set(item.weaponCategory, list)
  }

  type ActionRow = {
    key: string
    label: string
    notes?: string
    def: (typeof COMBAT_SKILLS)[number]
    level: number
    attrValue: number
    total: number
  }

  const actions: ActionRow[] = []
  for (const def of COMBAT_SKILLS) {
    if (def.category !== 'action') continue
    const level = skillByName.get(def.id)?.level ?? 0
    const attrValue = def.attribute
      ? (character.attributes[def.attribute] ?? 0)
      : 0
    const total = level + attrValue
    if (def.requiresWeapon) {
      const weapons = equippedByCategory.get(def.requiresWeapon) ?? []
      for (const w of weapons) {
        actions.push({
          key: `${def.id}:${w.id}`,
          label: w.name || def.name,
          notes: w.notes,
          def,
          level,
          attrValue,
          total,
        })
      }
    } else {
      actions.push({
        key: def.id,
        label: def.name,
        def,
        level,
        attrValue,
        total,
      })
    }
  }

  return (
    <div className="space-y-3">
      {character.currentHp === 0 && (
        <ReadOnlySection title="Death saves">
          <DeathSavePanel character={character} onApply={onTakeDamage} />
        </ReadOnlySection>
      )}

      <ReadOnlySection title="Take damage">
        <TakeDamagePanel character={character} onApply={onTakeDamage} />
      </ReadOnlySection>

      <ReadOnlySection title="Actions in combat">
        {actions.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">
            No actions available — equip a weapon on the General tab.
          </p>
        ) : (
          <ul className="space-y-1">
            {actions.map((a) => (
              <li
                key={a.key}
                className="flex items-center justify-between gap-3 rounded bg-zinc-900 border border-zinc-800 px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm text-zinc-100">{a.label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                      {a.def.name}
                    </span>
                  </div>
                  {a.notes && (
                    <div className="text-xs text-zinc-300">{a.notes}</div>
                  )}
                  <div className="text-xs text-zinc-500 font-mono">
                    Skill {fmt(a.level)}
                    {a.def.attribute &&
                      ` · ${a.def.attribute} ${fmt(a.attrValue)}`}
                  </div>
                </div>
                <span className="text-base font-mono text-amber-300 whitespace-nowrap">
                  {fmt(a.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </ReadOnlySection>

      <ReadOnlySection title="Reactions">
        <ul className="space-y-2">
          <ReactionRow
            name="Move your character"
            description="Use your reaction to move."
          />
          <ReactionRow
            name="Opportunity attack"
            description="Attack a creature that leaves your reach."
          />
          <ReactionRow
            name="Parry"
            description={
              <>
                Subtract <span className="font-mono text-amber-300">1d4 + {parryLv}</span>{' '}
                from an attack roll made by a creature adjacent to you.
              </>
            }
          />
        </ul>
      </ReadOnlySection>

    </div>
  )
}

function ReactionRow({
  name,
  description,
}: {
  name: string
  description: React.ReactNode
}) {
  return (
    <li className="rounded bg-zinc-900 border border-zinc-800 px-3 py-2">
      <div className="text-sm text-zinc-100">{name}</div>
      <div className="text-xs text-zinc-400">{description}</div>
    </li>
  )
}

function fmt(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}

interface SkillListProps {
  skills: { id: string; name: string; level: number }[]
}

function SkillList({ skills }: SkillListProps) {
  return (
    <ul className="space-y-1">
      {skills.map((s) => (
        <li
          key={s.id}
          className="flex items-center justify-between rounded bg-zinc-900 border border-zinc-800 px-3 py-2"
        >
          <span className="text-sm text-zinc-100">{s.name}</span>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-500 font-mono">
              {skillCost(s.level)} BP
            </span>
            <span className="text-amber-300 font-mono">Lv {s.level}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

interface ResourcesCardProps {
  character: Character
  onAdjustHp: (delta: number) => void
  onAdjustEp: (delta: number) => void
}

function ResourcesCard({
  character,
  onAdjustHp,
  onAdjustEp,
}: ResourcesCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-3">
      <ResourceRow
        label="HP"
        current={character.currentHp}
        max={character.hp}
        color="rose"
        onAdjust={onAdjustHp}
      />
      <div className="h-px bg-zinc-800" />
      <ResourceRow
        label="EP"
        current={character.currentEp}
        max={character.ep}
        color="sky"
        onAdjust={onAdjustEp}
      />
    </div>
  )
}

interface ResourceRowProps {
  label: string
  current: number
  max: number
  color: 'rose' | 'sky'
  onAdjust: (delta: number) => void
}

function ResourceRow({
  label,
  current,
  max,
  color,
  onAdjust,
}: ResourceRowProps) {
  const [delta, setDelta] = useState('')
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const fill = color === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
  const accent = color === 'rose' ? 'text-rose-300' : 'text-sky-300'
  const parsed = (() => {
    if (delta.trim() === '') return 1
    const n = Math.abs(Math.floor(Number(delta)))
    return Number.isFinite(n) && n > 0 ? n : 0
  })()
  const apply = (sign: 1 | -1) => {
    if (parsed === 0) return
    onAdjust(sign * parsed)
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {label}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => apply(-1)}
            disabled={parsed === 0}
            aria-label={`Subtract ${parsed} ${label}`}
            className="rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 px-2 py-1 text-xs font-mono"
          >
            −
          </button>
          <input
            type="number"
            min={0}
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') apply(1)
            }}
            placeholder="1"
            className="w-12 bg-zinc-950 border border-zinc-700 rounded px-1.5 py-1 text-xs text-zinc-100 text-right font-mono"
          />
          <button
            type="button"
            onClick={() => apply(1)}
            disabled={parsed === 0}
            aria-label={`Add ${parsed} ${label}`}
            className="rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 px-2 py-1 text-xs font-mono"
          >
            +
          </button>
        </div>
        <div className={'font-mono text-lg ' + accent}>
          {current}
          <span className="text-zinc-500 text-xs"> / {max}</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded bg-zinc-800 overflow-hidden">
        <div
          className={'h-full transition-all ' + fill}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

interface DefenseCardProps {
  character: Character
}

function DefenseCard({ character }: DefenseCardProps) {
  const ev = evasion(character)
  const agility = character.attributes['Agility'] ?? 0
  const dodgeLv = combatSkillLevel(character, 'combat-dodge')

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-3">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Evasion
          </h3>
          <div className="font-mono text-lg text-amber-300">{ev}</div>
        </div>
        <div className="text-[10px] text-zinc-500 font-mono">
          10 + AGI {fmt(agility)} + Dodge {fmt(dodgeLv)}
          {(character.armorModifier ?? 0) > 0 && (
            <> − Armor {character.armorModifier}</>
          )}
          {equippedArmorEvasionReduction(character) > 0 && (
            <> − Worn {equippedArmorEvasionReduction(character)}</>
          )}
        </div>
      </div>
      <div className="h-px bg-zinc-800" />
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          Speed
        </h3>
        <div className="font-mono text-lg text-zinc-100">
          {character.speed ?? 20}
          <span className="text-zinc-500 text-xs"> ft</span>
        </div>
      </div>
    </div>
  )
}

function ReadOnlySection({
  title,
  children,
  collapsible,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  if (!collapsible) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
          {title}
        </h3>
        {children}
      </section>
    )
  }
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
          {title}
        </h3>
        <span className="text-zinc-500 text-xs font-mono">
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  )
}

function SaveBadge({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-xs">
      <span className="text-zinc-400">{label}</span>
      <span className="font-mono text-amber-300">{fmt(value)}</span>
    </span>
  )
}

function AttrPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded bg-zinc-900 border border-zinc-800 px-1 py-1.5">
      <span className="text-[10px] text-zinc-500 font-medium tracking-wide">
        {label}
      </span>
      <span className="font-mono text-sm text-zinc-100">{value}</span>
    </div>
  )
}
