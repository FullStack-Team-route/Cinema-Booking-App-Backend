import mongoose from "mongoose";
interface ISlot {
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
        slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
        auditoriums: string[];
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
        slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
        auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<{
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }> & {
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
    auditoriums: string[];
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
        slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
        auditoriums: string[];
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
        slots: mongoose.Types.DocumentArray<ISlot, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, ISlot> & ISlot>;
        auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<{
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }> & {
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }>;
    auditoriums: string[];
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
    slots: mongoose.Types.DocumentArray<{
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }> & {
        date: Date;
        time: string;
        ampm: "AM" | "PM";
        price: number;
        availableSeats: number;
        totalSeats: number;
    }>;
    auditoriums: string[];
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