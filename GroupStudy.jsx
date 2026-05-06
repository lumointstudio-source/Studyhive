import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useTheme } from '../context/ThemeContext'

export default function GroupStudy() {
  const { isDark } = useTheme()
  const [rooms, setRooms] = useLocalStorage('studyhive_rooms', [])
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [activeRoom, setActiveRoom] = useState(null)
  const [roomName, setRoomName] = useState('')
  const [participant, setParticipant] = useState({ name: '', minutes: '' })

  const handleCreateRoom = () => {
    if (!roomName.trim()) return
    const newRoom = {
      id: Date.now().toString(),
      name: roomName.trim(),
      participants: [],
      createdAt: new Date().toLocaleDateString(),
    }
    setRooms([...rooms, newRoom])
    setRoomName('')
    setShowRoomModal(false)
    setActiveRoom(newRoom)
  }

  const handleAddParticipant = () => {
    if (!participant.name.trim() || !participant.minutes) return
    const updatedRooms = rooms.map(r => {
      if (r.id !== activeRoom.id) return r
      const existing = r.participants.findIndex(p => p.name.toLowerCase() === participant.name.toLowerCase())
      let updatedParticipants
      if (existing >= 0) {
        updatedParticipants = r.participants.map((p, i) =>
          i === existing ? { ...p, minutes: p.minutes + Number(participant.minutes) } : p
        )
      } else {
        updatedParticipants = [...r.participants, { name: participant.name.trim(), minutes: Number(participant.minutes) }]
      }
      const updated = { ...r, participants: updatedParticipants.sort((a, b) => b.minutes - a.minutes) }
      setActiveRoom(updated)
      return updated
    })
    setRooms(updatedRooms)
    setParticipant({ name: '', minutes: '' })
    setShowParticipantModal(false)
  }

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id))
    if (activeRoom?.id === id) setActiveRoom(null)
  }

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const formatMinutes = (min) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">👥 Group Study</h1>
          <p className="page-subtitle">Create rooms and compete on study leaderboards.</p>
        </div>
        <button onClick={() => setShowRoomModal(true)} className="btn-primary mt-1">+ New Room</button>
      </div>

      {/* Demo notice */}
      <Card>
        <div className="flex gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-medium">Demo Mode</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Group study rooms are saved locally. Create a room, add participants manually, and track study minutes on your leaderboard.
            </p>
          </div>
        </div>
      </Card>

      {/* Rooms list */}
      {rooms.length === 0 ? (
        <Card>
          <EmptyState
            icon="👥"
            title="No Study Rooms"
            message="Create your first group study room to track your group's progress."
            action={
              <button onClick={() => setShowRoomModal(true)} className="btn-primary">
                + Create Room
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.map((room, i) => (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all animate-slide-up stagger-${Math.min(i + 1, 6)} ${
                activeRoom?.id === room.id ? 'border-cyan-500/50' : ''
              }`}
              onClick={() => setActiveRoom(room)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-heading font-semibold">{room.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {room.participants.length} member{room.participants.length !== 1 ? 's' : ''} · {room.createdAt}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDeleteRoom(room.id) }}
                  className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} text-danger`}
                >
                  🗑️
                </button>
              </div>
              {room.participants.length > 0 && (
                <div className="mt-3 flex items-center gap-1">
                  {room.participants.slice(0, 3).map((p, pi) => (
                    <div key={pi} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: `hsl(${pi * 120}, 60%, 40%)` }}>
                      {p.name[0].toUpperCase()}
                    </div>
                  ))}
                  {room.participants.length > 3 && (
                    <span className="text-xs text-slate-400 ml-1">+{room.participants.length - 3}</span>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Active room leaderboard */}
      {activeRoom && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-heading font-semibold">{activeRoom.name}</h2>
              <p className="text-xs text-slate-400">Leaderboard</p>
            </div>
            <button
              onClick={() => setShowParticipantModal(true)}
              className="btn-ghost text-xs px-3 py-2"
            >
              + Add Minutes
            </button>
          </div>

          {activeRoom.participants.length === 0 ? (
            <Card>
              <EmptyState
                icon="🏆"
                title="No Participants Yet"
                message="Add participants and their study minutes to see the leaderboard."
                action={
                  <button onClick={() => setShowParticipantModal(true)} className="btn-primary text-sm px-4 py-2">
                    + Add Participant
                  </button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-2">
              {activeRoom.participants.map((p, i) => (
                <Card key={i} className={`animate-slide-up stagger-${Math.min(i + 1, 6)} ${i === 0 ? 'border-yellow-500/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center flex-shrink-0">{getMedal(i)}</span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: `hsl(${i * 83}, 60%, 40%)` }}>
                      {p.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <div className="progress-bar mt-1.5">
                        <div className="progress-fill" style={{
                          width: `${(p.minutes / activeRoom.participants[0].minutes) * 100}%`
                        }} />
                      </div>
                    </div>
                    <span className="font-heading font-bold text-sm flex-shrink-0" style={{ color: i === 0 ? '#F59E0B' : '#00E5FF' }}>
                      {formatMinutes(p.minutes)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Room Modal */}
      <Modal isOpen={showRoomModal} onClose={() => { setShowRoomModal(false); setRoomName('') }} title="Create Study Room">
        <div className="space-y-4">
          <div>
            <label className="label">Room Name</label>
            <input
              className="input-field"
              placeholder="e.g., CSC 300L Finals Squad"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateRoom()}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setShowRoomModal(false); setRoomName('') }} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleCreateRoom} className="btn-primary flex-1">Create Room</button>
          </div>
        </div>
      </Modal>

      {/* Add Participant Modal */}
      <Modal isOpen={showParticipantModal} onClose={() => { setShowParticipantModal(false); setParticipant({ name: '', minutes: '' }) }} title="Add Study Minutes">
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Adding to: <span className="text-cyan-400">{activeRoom?.name}</span></p>
          <div>
            <label className="label">Participant Name</label>
            <input
              className="input-field"
              placeholder="e.g., Chidi, Ngozi..."
              value={participant.name}
              onChange={e => setParticipant({ ...participant, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Study Minutes</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g., 60"
              min="1"
              value={participant.minutes}
              onChange={e => setParticipant({ ...participant, minutes: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setShowParticipantModal(false); setParticipant({ name: '', minutes: '' }) }} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleAddParticipant} className="btn-primary flex-1">Add Minutes</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
