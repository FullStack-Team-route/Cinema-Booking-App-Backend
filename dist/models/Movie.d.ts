import mongoose from "mongoose";
export interface ISlot {
    save(): unknown;
    bookedSeats: any;
    date: Date;
    time: string;
    ampm: "AM" | "PM";
    price: number;
    availableSeats: number;
    totalSeats: number;
}
interface IPerson {
    name: string;
    role?: string;
    image?: string;
}
interface ITrailer {
    url?: string;
    thumbnail?: string;
    duration?: number;
    title?: string;
}
export declare const SlotSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: true;
}, {
    date: NativeDate;
    totalSeats: number;
    availableSeats: number;
    time: string;
    ampm: "AM" | "PM";
    seatTypes: mongoose.Types.DocumentArray<{
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }> & {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }>;
    bookedSeats: mongoose.Types.DocumentArray<{
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }> & {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }>;
    auditorium?: mongoose.Types.ObjectId | null;
}, mongoose.Document<unknown, {}, {
    date: NativeDate;
    totalSeats: number;
    availableSeats: number;
    time: string;
    ampm: "AM" | "PM";
    seatTypes: mongoose.Types.DocumentArray<{
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }> & {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }>;
    bookedSeats: mongoose.Types.DocumentArray<{
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }> & {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }>;
    auditorium?: mongoose.Types.ObjectId | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    _id: true;
}>> & Omit<{
    date: NativeDate;
    totalSeats: number;
    availableSeats: number;
    time: string;
    ampm: "AM" | "PM";
    seatTypes: mongoose.Types.DocumentArray<{
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }> & {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }>;
    bookedSeats: mongoose.Types.DocumentArray<{
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }> & {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }>;
    auditorium?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        _id: true;
    }>> & Omit<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    date: NativeDate;
    totalSeats: number;
    availableSeats: number;
    time: string;
    ampm: "AM" | "PM";
    seatTypes: mongoose.Types.DocumentArray<{
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }> & {
        type: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        label: string;
    }>;
    bookedSeats: mongoose.Types.DocumentArray<{
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }> & {
        seatType?: string | null;
        seatNumber?: string | null;
        seatId?: string | null;
    }>;
    auditorium?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const MovieSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        description: string;
        duration: number;
        title: string;
        poster: string;
        gallery: string[];
        ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
        releaseDate: NativeDate;
        language: string;
        year: number;
        genres: string[];
        category: "now-showing" | "coming-soon" | "featured" | "special-screening";
        featured: boolean;
        directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        slots: mongoose.Types.DocumentArray<{
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }> & {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }>;
        auditoriums: mongoose.Types.ObjectId[];
        isActive: boolean;
        originalTitle?: string | null;
        shortDescription?: string | null;
        backdrop?: string | null;
        trailer?: ITrailer | null;
        country?: string | null;
        imdbId?: string | null;
        rottenTomatoesScore?: number | null;
        budget?: number | null;
        boxOffice?: number | null;
        rating?: number | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        description: string;
        duration: number;
        title: string;
        poster: string;
        gallery: string[];
        ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
        releaseDate: NativeDate;
        language: string;
        year: number;
        genres: string[];
        category: "now-showing" | "coming-soon" | "featured" | "special-screening";
        featured: boolean;
        directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        slots: mongoose.Types.DocumentArray<{
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }> & {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }>;
        auditoriums: mongoose.Types.ObjectId[];
        isActive: boolean;
        originalTitle?: string | null;
        shortDescription?: string | null;
        backdrop?: string | null;
        trailer?: ITrailer | null;
        country?: string | null;
        imdbId?: string | null;
        rottenTomatoesScore?: number | null;
        budget?: number | null;
        boxOffice?: number | null;
        rating?: number | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    cast: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    writers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    producers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    singers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    }> & ({
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    })>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: {
        url?: string;
        thumbnail?: string;
        duration?: number;
        title?: string;
    } | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const Movie: mongoose.Model<{
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    }>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: ITrailer | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        description: string;
        duration: number;
        title: string;
        poster: string;
        gallery: string[];
        ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
        releaseDate: NativeDate;
        language: string;
        year: number;
        genres: string[];
        category: "now-showing" | "coming-soon" | "featured" | "special-screening";
        featured: boolean;
        directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        slots: mongoose.Types.DocumentArray<{
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }> & {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }>;
        auditoriums: mongoose.Types.ObjectId[];
        isActive: boolean;
        originalTitle?: string | null;
        shortDescription?: string | null;
        backdrop?: string | null;
        trailer?: ITrailer | null;
        country?: string | null;
        imdbId?: string | null;
        rottenTomatoesScore?: number | null;
        budget?: number | null;
        boxOffice?: number | null;
        rating?: number | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        cast: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        description: string;
        duration: number;
        title: string;
        poster: string;
        gallery: string[];
        ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
        releaseDate: NativeDate;
        language: string;
        year: number;
        genres: string[];
        category: "now-showing" | "coming-soon" | "featured" | "special-screening";
        featured: boolean;
        directors: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        writers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        producers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        singers: mongoose.Types.DocumentArray<IPerson, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, IPerson> & IPerson>;
        slots: mongoose.Types.DocumentArray<{
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }> & {
            date: NativeDate;
            totalSeats: number;
            availableSeats: number;
            time: string;
            ampm: "AM" | "PM";
            seatTypes: mongoose.Types.DocumentArray<{
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }> & {
                type: string;
                price: number;
                totalSeats: number;
                availableSeats: number;
                label: string;
            }>;
            bookedSeats: mongoose.Types.DocumentArray<{
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }> & {
                seatType?: string | null;
                seatNumber?: string | null;
                seatId?: string | null;
            }>;
            auditorium?: mongoose.Types.ObjectId | null;
        }>;
        auditoriums: mongoose.Types.ObjectId[];
        isActive: boolean;
        originalTitle?: string | null;
        shortDescription?: string | null;
        backdrop?: string | null;
        trailer?: ITrailer | null;
        country?: string | null;
        imdbId?: string | null;
        rottenTomatoesScore?: number | null;
        budget?: number | null;
        boxOffice?: number | null;
        rating?: number | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    cast: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    writers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    producers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    singers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    }> & ({
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    })>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: {
        url?: string;
        thumbnail?: string;
        duration?: number;
        title?: string;
    } | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    cast: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    description: string;
    duration: number;
    title: string;
    poster: string;
    gallery: string[];
    ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
    releaseDate: NativeDate;
    language: string;
    year: number;
    genres: string[];
    category: "now-showing" | "coming-soon" | "featured" | "special-screening";
    featured: boolean;
    directors: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    writers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    producers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    singers: mongoose.Types.DocumentArray<{
        name: string;
        role?: string;
        image?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        role?: string;
        image?: string;
    }> & {
        name: string;
        role?: string;
        image?: string;
    }>;
    slots: mongoose.Types.DocumentArray<{
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    }> & ({
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    } | {
        date: NativeDate;
        totalSeats: number;
        availableSeats: number;
        time: string;
        ampm: "AM" | "PM";
        seatTypes: mongoose.Types.DocumentArray<{
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }> & {
            type: string;
            price: number;
            totalSeats: number;
            availableSeats: number;
            label: string;
        }>;
        bookedSeats: mongoose.Types.DocumentArray<{
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }> & {
            seatType?: string | null;
            seatNumber?: string | null;
            seatId?: string | null;
        }>;
        auditorium?: string | null;
        _id: string;
    })>;
    auditoriums: mongoose.Types.ObjectId[];
    isActive: boolean;
    originalTitle?: string | null;
    shortDescription?: string | null;
    backdrop?: string | null;
    trailer?: {
        url?: string;
        thumbnail?: string;
        duration?: number;
        title?: string;
    } | null;
    country?: string | null;
    imdbId?: string | null;
    rottenTomatoesScore?: number | null;
    budget?: number | null;
    boxOffice?: number | null;
    rating?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=Movie.d.ts.map