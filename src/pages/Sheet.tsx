import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ensureCombatSkills,
  normalizeCurrentValues,
  restoreToMax,
  type Character,
} from '../system/character'
import { skillCost } from '../system/costs'
import { ATTRIBUTES } from '../system/attributes'
import { COMBAT_SKILLS, isCombatSkillId } from '../system/combatSkills'
import { MAGIC_MEDIUMS, MAGIC_SCHOOLS } from '../system/magicSchools'
import { TETHER_BP_BY_TIER, TETHER_TIERS } from '../system/tethers'
import { FLAW_BP_BY_SEVERITY, FLAW_SEVERITIES } from '../system/flaws'
import { getCharacter, updateCharacter } from '../lib/characters'
import { supabaseConfigured } from '../lib/supabase'
import { InventoryEditor } from '../components/InventoryEditor'
import { QuickCast } from '../components/QuickCast'

type Tab = 'general' | 'combat' | 'spellcasting'

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'combat', label: 'Combat' },
  { key: 'spellcasting', label: 'Spellcasting' },
]

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
        <div>
          <h2 className="text-2xl font-semibold text-zinc-100">
            {character.name}
          </h2>
          <p className="text-xs text-zinc-500">
            {character.tierName} · {character.bpBudget} BP
            {character.bonusBp ? ` (+${character.bonusBp})` : ''}
          </p>
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

      <div className="grid sm:grid-cols-2 gap-3">
        <ResourceCard
          label="Hit Points"
          current={character.currentHp}
          max={character.hp}
          color="rose"
          onAdjust={adjustHp}
        />
        <ResourceCard
          label="Energy Points"
          current={character.currentEp}
          max={character.ep}
          color="sky"
          onAdjust={adjustEp}
        />
      </div>

      <ReadOnlySection title="Attributes">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {ATTRIBUTES.map((a) => (
            <Stat key={a} label={a} value={character.attributes[a]} />
          ))}
        </div>
      </ReadOnlySection>

      <div className="flex justify-end">
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
        <div className="space-y-3">
          <ReadOnlySection title="Combat skills">
            <SkillList skills={combatSkills} />
          </ReadOnlySection>
        </div>
      )}

      {tab === 'spellcasting' && (
        <div className="space-y-3">
          {hasMagic && (
            <ReadOnlySection title="Quick cast">
              <QuickCast
                schools={character.magicSchools}
                mediums={character.magicMediums}
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
              />
            </ReadOnlySection>
          )}
          {hasMagic ? (
            <>
              {Object.values(character.magicSchools).some((v) => v > 0) && (
                <ReadOnlySection title="Schools">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MAGIC_SCHOOLS.filter(
                      (s) => character.magicSchools[s] > 0,
                    ).map((s) => (
                      <Stat
                        key={s}
                        label={s}
                        value={character.magicSchools[s]}
                      />
                    ))}
                  </div>
                </ReadOnlySection>
              )}
              {Object.values(character.magicMediums).some((v) => v > 0) && (
                <ReadOnlySection title="Mediums">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MAGIC_MEDIUMS.filter(
                      (m) => character.magicMediums[m] > 0,
                    ).map((m) => (
                      <Stat
                        key={m}
                        label={m}
                        value={character.magicMediums[m]}
                      />
                    ))}
                  </div>
                </ReadOnlySection>
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

          {character.tethers.length > 0 && (
            <ReadOnlySection title="Tethers">
              <ul className="space-y-2">
                {character.tethers.map((t) => {
                  const tierLabel =
                    TETHER_TIERS.find((opt) => opt.tier === t.tier)?.label ??
                    `Tier ${t.tier}`
                  return (
                    <li
                      key={t.id}
                      className="flex items-start justify-between gap-3 rounded bg-zinc-900 border border-zinc-800 px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-zinc-300">
                          {t.description || (
                            <span className="italic text-zinc-500">
                              No description
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">
                          {tierLabel}
                        </div>
                      </div>
                      <span className="text-xs text-emerald-300 font-mono whitespace-nowrap">
                        +{TETHER_BP_BY_TIER[t.tier]} BP
                      </span>
                    </li>
                  )
                })}
              </ul>
            </ReadOnlySection>
          )}
          {character.flaws.length > 0 && (
            <ReadOnlySection title="Flaws">
              <ul className="space-y-2">
                {character.flaws.map((f) => {
                  const sevLabel =
                    FLAW_SEVERITIES.find((opt) => opt.key === f.severity)
                      ?.label ?? f.severity
                  return (
                    <li
                      key={f.id}
                      className="flex items-start justify-between gap-3 rounded bg-zinc-900 border border-zinc-800 px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-zinc-300">
                          {f.description || (
                            <span className="italic text-zinc-500">
                              No description
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">
                          {sevLabel}
                        </div>
                      </div>
                      <span className="text-xs text-emerald-300 font-mono whitespace-nowrap">
                        +{FLAW_BP_BY_SEVERITY[f.severity]} BP
                      </span>
                    </li>
                  )
                })}
              </ul>
            </ReadOnlySection>
          )}
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

interface ResourceCardProps {
  label: string
  current: number
  max: number
  color: 'rose' | 'sky'
  onAdjust: (delta: number) => void
}

function ResourceCard({
  label,
  current,
  max,
  color,
  onAdjust,
}: ResourceCardProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const fill = color === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
  const accent = color === 'rose' ? 'text-rose-300' : 'text-sky-300'
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
          {label}
        </h3>
        <div className={'font-mono text-xl ' + accent}>
          {current}
          <span className="text-zinc-500 text-sm"> / {max}</span>
        </div>
      </div>
      <div className="h-2 w-full rounded bg-zinc-800 overflow-hidden">
        <div
          className={'h-full transition-all ' + fill}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-2">
        {[-5, -1, +1, +5].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onAdjust(d)}
            className="flex-1 rounded bg-zinc-800 hover:bg-zinc-700 px-2 py-1.5 text-sm font-mono"
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
      </div>
    </div>
  )
}

function ReadOnlySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded bg-zinc-900 border border-zinc-800 px-3 py-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <span className="font-mono text-zinc-100">{value}</span>
    </div>
  )
}
