export const GRADE_POINTS = {
  A: 5.0,
  B: 4.0,
  C: 3.0,
  D: 2.0,
  E: 1.0,
  F: 0.0,
}

export function calculateGPA(courses) {
  if (!courses || courses.length === 0) return { gpa: 0, totalUnits: 0, totalPoints: 0 }

  const totalUnits = courses.reduce((sum, c) => sum + Number(c.units), 0)
  const totalPoints = courses.reduce((sum, c) => {
    const gradePoint = GRADE_POINTS[c.grade] ?? 0
    return sum + gradePoint * Number(c.units)
  }, 0)

  const gpa = totalUnits > 0 ? totalPoints / totalUnits : 0
  return {
    gpa: Math.round(gpa * 100) / 100,
    totalUnits,
    totalPoints: Math.round(totalPoints * 100) / 100,
  }
}

export function getGPAClass(gpa) {
  if (gpa >= 4.5) return { label: 'First Class', color: '#22C55E' }
  if (gpa >= 3.5) return { label: 'Second Class Upper', color: '#00E5FF' }
  if (gpa >= 2.5) return { label: 'Second Class Lower', color: '#6C5CE7' }
  if (gpa >= 1.5) return { label: 'Third Class', color: '#F97316' }
  return { label: 'Pass', color: '#EF4444' }
}

export function getGradeColor(grade) {
  const colors = {
    A: '#22C55E',
    B: '#00E5FF',
    C: '#6C5CE7',
    D: '#F97316',
    E: '#F59E0B',
    F: '#EF4444',
  }
  return colors[grade] || '#94A3B8'
}
