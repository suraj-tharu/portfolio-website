import { useState } from 'react';
import { Calendar, Clock, Video, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetingWidget() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableDates = ["Oct 24", "Oct 25", "Oct 28", "Oct 29"];
  const availableTimes = ["10:00 AM", "1:30 PM", "3:00 PM", "4:30 PM"];

  return (
    <div className="w-full max-w-md bg-[var(--surface-2)] border border-[var(--stroke)] rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[var(--surface)] p-6 border-b border-[var(--stroke)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center border border-[var(--brand)]/20">
            <Video className="text-[var(--brand)]" size={20} />
          </div>
          <div>
            <h3 className="text-[var(--text)] font-semibold">Introductory Call</h3>
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-1">
              <Clock size={12} /> 30 min
              <span className="mx-1">•</span>
              <Video size={12} /> Google Meet
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h4 className="text-sm text-[var(--text-secondary)] font-medium mb-4 flex items-center gap-2">
                <Calendar size={16} /> Select a Date
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-xl border text-sm text-center transition-all ${
                      selectedDate === date 
                        ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]' 
                        : 'border-[var(--stroke)] hover:border-[var(--muted)] text-[var(--text)] bg-[var(--surface)]'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>

              <h4 className="text-sm text-[var(--text-secondary)] font-medium mb-4 flex items-center gap-2">
                <Clock size={16} /> Select a Time
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    disabled={!selectedDate}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border text-sm text-center transition-all ${
                      !selectedDate ? 'opacity-50 cursor-not-allowed border-[var(--stroke)] text-[var(--muted)]' :
                      selectedTime === time 
                        ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]' 
                        : 'border-[var(--stroke)] hover:border-[var(--muted)] text-[var(--text)] bg-[var(--surface)]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <button 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl bg-[var(--brand)] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              >
                Continue <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-xl text-[var(--text)] font-semibold mb-2">Meeting Requested</h3>
              <p className="text-sm text-[var(--muted)] mb-6 max-w-[250px]">
                You're scheduled for {selectedDate} at {selectedTime}. A calendar invitation will be sent to your email.
              </p>
              <button 
                onClick={() => {
                  setStep(1);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="text-sm text-[var(--brand)] hover:underline"
              >
                Book another meeting
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
