

const Product = require('../models/productModel');
const Event = require('../models/eventModel');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dea3u3plr',
    api_key: '915639424628459',
    api_secret: 'pACRwoOSFU_6awkt8b1hlt3r2Pw'
});


// -------------------------- create event ---------------------
const createEvent = async (req, res) => {
  try {
    console.log('=== CREATE EVENT REQUEST ===');
    console.log('Request Body:', req.body);

    const { events } = req.body; // Expect an array of events

    // Validate that events is an array
    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of events',
        errors: ['Events array is required and cannot be empty']
      });
    }

    // Validate each event
    const validationErrors = [];
    const validEvents = [];

    events.forEach((event, index) => {
      const {
        title,
        details,
        condition,
        discount,
        eventImage // Accept array of image URLs
      } = event;

      const errors = [];
      
      if (!title) {
        errors.push('Title is required');
      }
      
      if (!details) {
        errors.push('Details are required');
      }
      
      if (!discount) {
        errors.push('Discount is required');
      }

      // Handle image URLs
      let eventImageUrls = [];
      if (eventImage) {
        if (typeof eventImage === 'string') {
          // If it's a comma-separated string
          eventImageUrls = eventImage.split(',').map(url => url.trim()).filter(url => url);
        } else if (Array.isArray(eventImage)) {
          eventImageUrls = eventImage.filter(url => url && url.trim());
        }
        
        // Validate URLs
        const invalidUrls = eventImageUrls.filter(url => {
          try {
            new URL(url);
            return false;
          } catch {
            return true;
          }
        });
        
        if (invalidUrls.length > 0) {
          errors.push(`Invalid image URLs at index ${index}: ${invalidUrls.join(', ')}`);
        }
      }

      if (errors.length > 0) {
        validationErrors.push({
          index: index,
          errors: errors,
          event: event
        });
      } else {
        validEvents.push({
          title: title.trim(),
          details: details.trim(),
          condition: condition ? condition.trim() : '',
          discount: discount.toString(),
          eventImage: eventImageUrls
        });
      }
    });

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for some events',
        errors: validationErrors
      });
    }

    console.log('Valid Events to save:', validEvents);

    // Create and save all events
    const savedEvents = await Event.insertMany(validEvents);

    console.log(`Successfully saved ${savedEvents.length} events`);

    res.status(201).json({
      success: true,
      message: `${savedEvents.length} events created successfully`,
      count: savedEvents.length,
      data: savedEvents
    });

  } catch (err) {
    console.error('Create Event Error Details:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry',
        error: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
// ----------------------- get all events ---------------------
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

// ----------------------- get single event ---------------------
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // Find event by ID
    const event = await Event.findById(id);

    // Check if event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: event
    });

  } catch (err) {
    console.error('Get Event Error:', err);

    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
const getEventsByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title search parameter is required'
      });
    }

    // Case-insensitive search
    const events = await Event.find({
      title: { $regex: title, $options: 'i' }
    });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No events found with the given title'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      count: events.length,
      data: events
    });

  } catch (err) {
    console.error('Search Events Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
// ----------------------- update event ---------------------
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== UPDATE EVENT REQUEST ===');
    console.log('Event ID:', id);
    console.log('Update Data:', req.body);

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // Check if event exists
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Extract fields from request body
    const {
      title,
      details,
      condition,
      discount,
      eventImage
    } = req.body;

    // Prepare update data
    const updateData = {};

    // Only add fields that are provided
    if (title) updateData.title = title.trim();
    if (details) updateData.details = details.trim();
    if (condition !== undefined) updateData.condition = condition ? condition.trim() : '';
    if (discount) updateData.discount = discount.toString();

    // Handle image URLs
    if (eventImage) {
      let eventImageUrls = [];
      
      if (typeof eventImage === 'string') {
        // If it's a comma-separated string
        eventImageUrls = eventImage.split(',').map(url => url.trim()).filter(url => url);
      } else if (Array.isArray(eventImage)) {
        eventImageUrls = eventImage.filter(url => url && url.trim());
      }
      
      // Validate URLs
      const invalidUrls = eventImageUrls.filter(url => {
        try {
          new URL(url);
          return false;
        } catch {
          return true;
        }
      });
      
      if (invalidUrls.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image URLs provided',
          invalidUrls: invalidUrls
        });
      }
      
      updateData.eventImage = eventImageUrls;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
    }

    console.log('Update Data:', updateData);

    // Find and update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run mongoose validation
      }
    );

    console.log('Event updated successfully:', updatedEvent._id);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });

  } catch (err) {
    console.error('Update Event Error Details:', err);

    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry',
        error: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// ----------------------- delete event ---------------------
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

module.exports = {

    createEvent,
    getAllEvents,
    getEventById,
    getEventsByTitle,
    updateEvent,
    deleteEvent
};