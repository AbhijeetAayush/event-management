package com.example.demo.service;

import com.example.demo.model.Attendee;
import com.example.demo.model.Event;
import com.example.demo.repository.AttendeeRepository;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendeeService {

    private final AttendeeRepository attendeeRepository;
    private final EventRepository eventRepository;

    @Autowired
    public AttendeeService(AttendeeRepository attendeeRepository, EventRepository eventRepository) {
        this.attendeeRepository = attendeeRepository;
        this.eventRepository = eventRepository;
    }

    public Attendee addAttendee(Long eventId, Attendee attendee) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) {
            throw new RuntimeException("Event not found");
        }
        Event event = eventOpt.get();
        attendee.setEvent(event);
        return attendeeRepository.save(attendee);
    }

    public void removeAttendee(Long attendeeId) {
        Optional<Attendee> attendeeOpt = attendeeRepository.findById(attendeeId);
        if (!attendeeOpt.isPresent()) {
            throw new RuntimeException("Attendee not found");
        }
        attendeeRepository.delete(attendeeOpt.get());
    }

    public List<Attendee> getAttendeesForEvent(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) {
            throw new RuntimeException("Event not found");
        }
        Event event = eventOpt.get();
        return event.getAttendees();
    }

    public Attendee getAttendee(Long attendeeId) {
        return attendeeRepository.findById(attendeeId)
                .orElseThrow(() -> new RuntimeException("Attendee not found"));
    }
}
