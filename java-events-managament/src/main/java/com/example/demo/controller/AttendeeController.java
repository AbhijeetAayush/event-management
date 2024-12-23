package com.example.demo.controller;

import com.example.demo.model.Attendee;
import com.example.demo.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendees")
public class AttendeeController {

    private final AttendeeService attendeeService;

    @Autowired
    public AttendeeController(AttendeeService attendeeService) {
        this.attendeeService = attendeeService;
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<Attendee> addAttendee(@PathVariable Long eventId, @RequestBody Attendee attendee) {
        Attendee createdAttendee = attendeeService.addAttendee(eventId, attendee);
        return new ResponseEntity<>(createdAttendee, HttpStatus.CREATED);
    }

    @DeleteMapping("/{attendeeId}")
    public ResponseEntity<Void> removeAttendee(@PathVariable Long attendeeId) {
        attendeeService.removeAttendee(attendeeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Attendee>> getAttendeesForEvent(@PathVariable Long eventId) {
        List<Attendee> attendees = attendeeService.getAttendeesForEvent(eventId);
        return new ResponseEntity<>(attendees, HttpStatus.OK);
    }

    @GetMapping("/{attendeeId}")
    public ResponseEntity<Attendee> getAttendee(@PathVariable Long attendeeId) {
        Attendee attendee = attendeeService.getAttendee(attendeeId);
        return new ResponseEntity<>(attendee, HttpStatus.OK);
    }
}
