import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const currencyVnd = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
})

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username: '', password: '' })
  const [user, setUser] = useState(null)

  const [tours, setTours] = useState([])
  const [loadingTours, setLoadingTours] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)

  const [bookingDraft, setBookingDraft] = useState(null)
  const [paymentResult, setPaymentResult] = useState(null)

  const [feedback, setFeedback] = useState(null)
  const [authProcessing, setAuthProcessing] = useState(false)
  const [bookingProcessing, setBookingProcessing] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  useEffect(() => {
    fetchTours()
  }, [])

  const stats = useMemo(() => ({
    totalTours: tours.length,
    cheapest: tours.length ? Math.min(...tours.map((t) => t.price)) : 0
  }), [tours])

  const showFeedback = (type, message) => {
    setFeedback({ type, message, at: new Date().toLocaleTimeString('vi-VN') })
  }

  const readErr = (error) => {
    const data = error.response?.data
    if (!data) return error.message
    const step = data.step ? ` [step: ${data.step}]` : ''
    const detail = typeof data.error === 'string'
      ? data.error
      : data.error?.message || ''
    return `${data.message || 'Request failed'}${step}${detail ? ` - ${detail}` : ''}`
  }

  const fetchTours = async () => {
    setLoadingTours(true)
    try {
      const res = await axios.get('/api/tours')
      setTours(res.data)
    } catch (error) {
      showFeedback('error', `Tai tour that bai: ${readErr(error)}`)
    } finally {
      setLoadingTours(false)
    }
  }

  const submitAuth = async (e) => {
    e.preventDefault()
    if (!authForm.username.trim() || !authForm.password.trim()) {
      showFeedback('error', 'Nhap day du username va password.')
      return
    }

    setAuthProcessing(true)
    try {
      if (authMode === 'register') {
        const res = await axios.post('/api/auth/register', authForm)
        setUser(res.data)
        showFeedback('success', `Dang ky thanh cong: ${res.data.username}`)
      } else {
        const res = await axios.post('/api/auth/login', authForm)
        setUser(res.data.user)
        showFeedback('success', `Dang nhap thanh cong: ${res.data.user.username}`)
      }
      setAuthForm({ username: '', password: '' })
    } catch (error) {
      showFeedback('error', `${authMode === 'login' ? 'Dang nhap' : 'Dang ky'} that bai: ${readErr(error)}`)
    } finally {
      setAuthProcessing(false)
    }
  }

  const selectTour = async (id) => {
    try {
      const res = await axios.get(`/api/tours/${id}`)
      setSelectedTour(res.data)
      setBookingDraft(null)
      setPaymentResult(null)
    } catch (error) {
      showFeedback('error', `Tai chi tiet tour that bai: ${readErr(error)}`)
    }
  }

  const createBooking = async () => {
    if (!user || !selectedTour) {
      showFeedback('error', 'Can dang nhap va chon tour truoc.')
      return
    }

    setBookingProcessing(true)
    try {
      const res = await axios.post('/api/bookings', {
        userId: user.id,
        tourId: selectedTour.id
      })
      const booking = res.data?.booking || res.data
      if (!booking?.id) {
        throw new Error('Booking response is invalid (missing booking id)')
      }
      setBookingDraft(booking)
      showFeedback('success', `Da tao booking #${booking.id}. Chuyen sang buoc thanh toan.`)
    } catch (error) {
      showFeedback('error', `Tao booking that bai: ${readErr(error)}`)
    } finally {
      setBookingProcessing(false)
    }
  }

  const payBooking = async () => {
    if (!bookingDraft) return

    setPaymentProcessing(true)
    try {
      const res = await axios.post('/api/payments', {
        bookingId: bookingDraft.id
      }, { timeout: 12000 })
      setPaymentResult(res.data)
      showFeedback('success', `Thanh toan thanh cong booking #${bookingDraft.id}. Da gui xac nhan.`)
    } catch (error) {
      showFeedback('error', `Thanh toan that bai: ${readErr(error)}`)
    } finally {
      setPaymentProcessing(false)
    }
  }

  return (
    <div className="app-shell">
      <main className="layout">
        <section className="card hero">
          <p className="eyebrow">Flow Dat Tour Day Du</p>
          <h1>Chon tour &gt; Dat tour &gt; Thanh toan &gt; Nhan xac nhan</h1>
          <div className="stat-grid">
            <article><span>{stats.totalTours}</span><p>Tour</p></article>
            <article><span>{stats.cheapest ? currencyVnd.format(stats.cheapest) : '--'}</span><p>Gia thap nhat</p></article>
            <article><span>{user ? user.username : 'Khach'}</span><p>Nguoi dung hien tai</p></article>
          </div>
        </section>

        <section className="panel-grid">
          <article className="card">
            <div className="section-head">
              <h2>1. Quan ly nguoi dung</h2>
              <div className="mode-switch">
                <button className={authMode === 'login' ? 'ghost-button active' : 'ghost-button'} onClick={() => setAuthMode('login')}>Dang nhap</button>
                <button className={authMode === 'register' ? 'ghost-button active' : 'ghost-button'} onClick={() => setAuthMode('register')}>Dang ky</button>
              </div>
            </div>
            {!user ? (
              <form className="form-stack" onSubmit={submitAuth}>
                <label>Username<input value={authForm.username} onChange={(e) => setAuthForm((p) => ({ ...p, username: e.target.value }))} /></label>
                <label>Password<input type="password" value={authForm.password} onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))} /></label>
                <button type="submit" disabled={authProcessing}>{authProcessing ? 'Dang xu ly...' : authMode === 'login' ? 'Dang nhap' : 'Dang ky'}</button>
              </form>
            ) : <div className="user-chip">Da dang nhap: <strong>{user.username}</strong> (ID: {user.id})</div>}
          </article>

          <article className="card">
            <h2>2. Quan ly tour</h2>
            <button className="ghost-button" onClick={fetchTours} disabled={loadingTours}>{loadingTours ? 'Dang tai...' : 'Tai danh sach tour'}</button>
            <div className="tour-grid" style={{ marginTop: 12 }}>
              {tours.map((tour) => (
                <article className="tour-card" key={tour.id}>
                  <div className="tour-badge">#{tour.id}</div>
                  <h3>{tour.name}</h3>
                  <p className="price">{currencyVnd.format(tour.price)}</p>
                  <button onClick={() => selectTour(tour.id)}>Xem chi tiet</button>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="panel-grid">
          <article className="card">
            <h2>3. Dat tour (Tao booking)</h2>
            {selectedTour ? (
              <div className="detail-box">
                <p><strong>Tour da chon:</strong> {selectedTour.name}</p>
                <p><strong>Gia:</strong> {currencyVnd.format(selectedTour.price)}</p>
                <p><strong>Slot:</strong> {selectedTour.slots}</p>
                <button onClick={createBooking} disabled={bookingProcessing || !user}>{bookingProcessing ? 'Dang tao...' : 'Tao booking'}</button>
              </div>
            ) : <p className="muted">Chua chon tour.</p>}

            {bookingDraft && (
              <div className="confirm-box" style={{ marginTop: 10 }}>
                Booking da tao: <strong>#{bookingDraft.id}</strong> - Trang thai: {bookingDraft.status}
              </div>
            )}
          </article>

          <article className="card">
            <h2>4. Thanh toan booking</h2>
            {bookingDraft ? (
              <div className="detail-box">
                <p><strong>Booking ID:</strong> {bookingDraft.id}</p>
                <p><strong>So tien:</strong> {currencyVnd.format(bookingDraft.amount)}</p>
                <button onClick={payBooking} disabled={paymentProcessing}>{paymentProcessing ? 'Dang thanh toan...' : 'Thanh toan ngay'}</button>
              </div>
            ) : <p className="muted">Can tao booking truoc khi thanh toan.</p>}
          </article>
        </section>

        <section className="card">
          <h2>5. Xac nhan</h2>
          {paymentResult ? (
            <div className="confirm-box">
              <p><strong>Trang thai:</strong> Thanh cong</p>
              <p><strong>Booking:</strong> #{paymentResult.bookingId}</p>
              <p><strong>Transaction:</strong> {paymentResult.payment?.transactionId}</p>
              <p><strong>Thong bao:</strong> {paymentResult.confirmation?.status} qua {paymentResult.confirmation?.channel}</p>
              <p><strong>Nguoi nhan:</strong> {paymentResult.confirmation?.recipient}</p>
            </div>
          ) : (
            <p className="muted">Chua co xac nhan. Hoan tat thanh toan de nhan thong bao booking thanh cong.</p>
          )}

          {feedback && <div className={`feedback ${feedback.type}`} style={{ marginTop: 10 }}><p>{feedback.message}</p><small>{feedback.at}</small></div>}
        </section>
      </main>
    </div>
  )
}

export default App
