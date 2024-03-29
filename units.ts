import { Dimensionless, Dimensions } from "./dimensions.ts";
import { QuantityError } from "./error.ts";

/** SI prefixes */
export const prefixes = Object.freeze(
    {
        q: 1e-30,
        r: 1e-27,
        y: 1e-24,
        z: 1e-21,
        a: 1e-18,
        f: 1e-15,
        p: 1e-12,
        n: 1e-9,
        u: 1e-6,
        µ: 1e-6,
        m: 1e-3,
        c: 1e-2,
        d: 1e-1,
        // We do not support the "da" prefix (although official, it is rarely used, and this allows us to assume that all 1-digit prefixes are metric/SI and all 2-digit are binary)
        // da: 1e+1,
        h: 1e+2,
        k: 1e+3,
        M: 1e+6,
        G: 1e+9,
        T: 1e+12,
        P: 1e+15,
        E: 1e+18,
        Z: 1e+21,
        Y: 1e+24,
        R: 1e+27,
        Q: 1e+30,
        Ki: 1.024e+3,
        Mi: 1.048576e+6,
        Gi: 1.073741824e+9,
        Ti: 1.099511627776e+12,
        Pi: 1.125899906842624e+15,
        Ei: 1.152921504606847e+18,
        Zi: 1.1805916207174113e+21,
        Yi: 1.2089258196146292e+24,
    } as const satisfies Record<string, number>,
);

type Prefix = keyof typeof prefixes;

/**
 * Defines a Unit, like "kg" (kilograms), "W" (Watts), or "HP" (horsepower)
 */
export interface Unit {
    /** Scale (relative to SI base unit for these dimensions) */
    readonly s: number;
    /** Dimensions (e.g. 'distance' for meters, 'distance^3' for liters, or 'mass' for kilograms) */
    readonly d: Dimensions;
    /** Offset: required for units where 0 value is different from 0 in the base SI unit (e.g. Farenheit) */
    readonly offset?: number;
    /** Can metric prefixes like k-, m-, M-, etc. be used with this unit? */
    readonly prefixable?: true;
    /** Can binary prefixes like Ki-, Mi-, Gi-, etc. be used with this unit? */
    readonly binaryPrefixable?: true;
}

const MASS_DIMENSION: Dimensions = new Dimensions([1, 0, 0, 0, 0, 0, 0, 0]);
const DIST_DIMENSION: Dimensions = new Dimensions([0, 1, 0, 0, 0, 0, 0, 0]);
const TIME_DIMENSION: Dimensions = new Dimensions([0, 0, 1, 0, 0, 0, 0, 0]);
const TEMP_DIMENSION: Dimensions = new Dimensions([0, 0, 0, 1, 0, 0, 0, 0]);

const NRGY_DIMENSIONS: Dimensions = new Dimensions([1, 2, -2, 0, 0, 0, 0, 0]);
const POWR_DIMENSIONS: Dimensions = new Dimensions([1, 2, -3, 0, 0, 0, 0, 0]);
const VOLM_DIMENSIONS: Dimensions = new Dimensions([0, 3, 0, 0, 0, 0, 0, 0]);
const AREA_DIMENSIONS: Dimensions = new Dimensions([0, 2, 0, 0, 0, 0, 0, 0]);
const INFO_DIMENSIONS: Dimensions = new Dimensions([0, 0, 0, 0, 0, 0, 0, 1]);
const PRSR_DIMENSIONS: Dimensions = new Dimensions([1, -1, -2, 0, 0, 0, 0, 0]);

/**
 * List of all the units built in to quantity-math-js.
 *
 * In addition to all of these, you can also use custom units (anything starting
 * with an underscore).
 */
export const builtInUnits = Object.freeze(
    {
        // Dimensionless:

        // "1": { s: 1e+0, "d": Dimensionless },
        /** Percent */
        "%": { s: 1e-2, d: Dimensionless },
        /** Parts per million */
        "ppm": { s: 1e-6, d: Dimensionless },
        // "ppb": { s: 1e-9, "d": Dimensionless },
        // "ppt": { s: 1e-12, "d": Dimensionless },

        // Mass:

        "g": { s: 1e-3, d: MASS_DIMENSION, prefixable: true },
        // "Da": { s: 1.6605390666e-27, d: MASS_DIMENSION },
        // "u": { s: 1.6605390666e-27, d: MASS_DIMENSION },
        // "AMU": { s: 1.6605390666e-27, d: MASS_DIMENSION },
        // "grain": { s: 6.479891e-5, d: MASS_DIMENSION },
        // "ozm": { s: 2.8349523125e-2, d: MASS_DIMENSION },
        // "dram": { s: 1.7718451953125e-3, d: MASS_DIMENSION },
        /** Pound */
        "lb": { s: 4.5359237e-1, d: MASS_DIMENSION },
        // "stone": { s: 6.35029318e+0, d: MASS_DIMENSION },
        // "sg": { s: 1.45939029372064e+1, d: MASS_DIMENSION },
        // "slug": { s: 1.45939029372064e+1, d: MASS_DIMENSION },
        // "cwt": { s: 4.5359237e+1, d: MASS_DIMENSION },
        // "dwt": { s: 1.55517384e-3, d: MASS_DIMENSION },
        // "uk_cwt": { s: 5.080234544e+1, d: MASS_DIMENSION },
        // "ton": { s: 9.0718474e+2, d: MASS_DIMENSION },
        // "uk_ton": { s: 1.0160469088e+3, d: MASS_DIMENSION },
        // "metric_ton": { s: 1e+3, d: MASS_DIMENSION },
        // "tonne": { s: 1e+3, d: MASS_DIMENSION },
        // "carat": { s: 2e-4, d: MASS_DIMENSION },
        // "assay_ton": { s: 2.9166666666666667e-2, d: MASS_DIMENSION },

        // "denier": { s: 1.1111111111111112e-7, d: new Dimensions([1, -1, 0, 0, 0, 0, 0, 0]) },
        // "tex": { s: 1e-6, d: new Dimensions([1, -1, 0, 0, 0, 0, 0, 0]) },

        // Distance:

        /** Meter */
        "m": { s: 1e+0, d: DIST_DIMENSION, prefixable: true },
        // "ang": { s: 1e-10, d: DIST_DIMENSION },
        // "picapt": { s: 3.52777777777778e-4, d: DIST_DIMENSION },
        // "pica": { s: 4.23333333333333e-3, d: DIST_DIMENSION },
        /** Inches */
        "in": { s: 2.54e-2, d: DIST_DIMENSION },
        // "mil": { s: 2.54e-5, d: DIST_DIMENSION },
        "ft": { s: 3.048e-1, d: DIST_DIMENSION },
        // "yd": { s: 9.144e-1, d: DIST_DIMENSION },
        // "ell": { s: 1.143e+0, d: DIST_DIMENSION },
        "mi": { s: 1.609344e+3, d: DIST_DIMENSION },
        // "survey_mi": { s: 1.6093472186944373e+3, d: DIST_DIMENSION },
        // "nmi": { s: 1.852e+3, d: DIST_DIMENSION },
        // "Nmi": { s: 1.852e+3, d: DIST_DIMENSION },
        // "league": { s: 5.556e+3, d: DIST_DIMENSION },
        // "ly": { s: 9.4607304725808e+15, d: DIST_DIMENSION },
        // "parsec": { s: 3.08567758128155e+16, d: DIST_DIMENSION },
        // "survey_ft": { s: 3.048006096012192e-1, d: DIST_DIMENSION },
        // "AU": { s: 1.495978707e+11, d: DIST_DIMENSION },
        // "chain": { s: 2.0116840233680467e+1, d: DIST_DIMENSION },
        // "link": { s: 2.0116840233680466e-1, d: DIST_DIMENSION },
        // "rod": { s: 5.029210058420117e+0, d: DIST_DIMENSION },
        // "furlong": { s: 2.0116840233680466e+2, d: DIST_DIMENSION },
        // "fathom": { s: 1.8288e+0, d: DIST_DIMENSION },
        // "us_fathom": { s: 1.828803657607315e+0, d: DIST_DIMENSION },
        // "fermi": { s: 1e-15, d: DIST_DIMENSION },
        // "datamile": { s: 1.8288e+3, d: DIST_DIMENSION },

        // Inverse distance

        // "kayser": { s: 1e+2, d: new Dimensions([0, -1, 0, 0, 0, 0, 0, 0]) },

        // Time
        // Note: NIST advises that "to avoid confusion, prefix symbols (and prefix names) are not used with the
        // time-related unit symbols (names) min (minute), h (hour), d (day)"

        /** Seconds */
        "s": { s: 1e+0, d: TIME_DIMENSION, prefixable: true },
        // "sec": { s: 1e+0, d: TIME_DIMENSION },
        /** Minutes */
        "min": { s: 6e+1, d: TIME_DIMENSION },
        /** Hours */
        "h": { s: 3.6e+3, d: TIME_DIMENSION },
        // "hr": { s: 3.6e+3, d: TIME_DIMENSION },
        /** Days */
        "day": { s: 8.64e+4, d: TIME_DIMENSION },
        "week": { s: 6.048e+5, d: TIME_DIMENSION },
        // "fortnight": { s: 1.2096e+6, d: TIME_DIMENSION },
        /** Year (defined as 365 days) */
        "yr": { s: 3.1536e+7, d: TIME_DIMENSION },
        // "shake": { s: 1e-8, d: TIME_DIMENSION },
        // Only a few prefixes are accepted for use with "yr", and it becomes "a" (from the Latin annus)
        // when prefixed in such a way:
        /** kilo anum (thousand years) */
        "ka": { s: 3.1536e+10, d: TIME_DIMENSION },
        /** mega anum (million years) */
        "Ma": { s: 3.1536e+13, d: TIME_DIMENSION },
        /** giga anum (billion years) */
        "Ga": { s: 3.1536e+16, d: TIME_DIMENSION },

        // Temperature

        /** Kelvins */
        "K": { s: 1e+0, d: TEMP_DIMENSION, prefixable: true },
        /** Difference in temperature, degrees Celcius */
        "deltaC": { s: 1e+0, d: TEMP_DIMENSION },
        /** A specific temperature, in degrees Fahrenheit */
        "degF": { s: 5.555555555555556e-1, d: TEMP_DIMENSION, offset: 2.553722222222222e+2 },
        /** A specific temperature, in degrees Celcius, like "water freezes at 0°C"; not a relative temperature. */
        "degC": { s: 1e+0, d: TEMP_DIMENSION, offset: 2.7315e+2 },
        // "Ra": { s: 5.555555555555556e-1, d: TEMP_DIMENSION },
        // "Rank": { s: 5.555555555555556e-1, d: TEMP_DIMENSION },
        // "deltaF": { s: 5.555555555555556e-1, d: TEMP_DIMENSION },
        // "Reau": { s: 1.25e+0, d: TEMP_DIMENSION, "o": 2.7315e+2 },
        // "deltaReau": { s: 1.25e+0, d: TEMP_DIMENSION },

        // Speed

        // "kph": { s: 2.777777777777778e-1, d: new Dimensions([0, 1, -1, 0, 0, 0, 0, 0]) },
        // "mph": { s: 4.4704e-1, d: new Dimensions([0, 1, -1, 0, 0, 0, 0, 0]) },
        // "fps": { s: 3.048e-1, d: new Dimensions([0, 1, -1, 0, 0, 0, 0, 0]) },
        // "knot": { s: 5.14444444444444e-1, d: new Dimensions([0, 1, -1, 0, 0, 0, 0, 0]) },
        // "admkn": { s: 5.14773333333333e-1, d: new Dimensions([0, 1, -1, 0, 0, 0, 0, 0]) },
        "c": { s: 2.99792458e+8, d: new Dimensions([0, 1, -1, 0, 0, 0, 0, 0]) },
        // "grav": { s: 9.80665e+0, d: new Dimensions([0, 1, -2, 0, 0, 0, 0, 0]) },
        // "galileo": { s: 1e-2, d: new Dimensions([0, 1, -2, 0, 0, 0, 0, 0]) },
        /** Pascal: SI standard unit for pressure defined as 1 N/m^2 */
        "Pa": { s: 1e+0, d: PRSR_DIMENSIONS, prefixable: true },
        // "mHg": { s: 1.3332239e+5, d: PRSR_DIMENSIONS },
        // "mH2O": { s: 9.80665e+3, d: PRSR_DIMENSIONS },
        // "Torr": { s: 1.33322368421053e+2, d: PRSR_DIMENSIONS },
        /** Pounds per square inch */
        "psi": { s: 6.89475729316836e+3, d: PRSR_DIMENSIONS },
        /** Standard atmosphere, equal to 101325 pascals (Pa) */
        "atm": { s: 1.01325e+5, d: PRSR_DIMENSIONS },
        /** The bar is a deprecated metric unit of pressure */
        // "bar": { s: 1e+5, d: PRSR_DIMENSIONS },
        // "inHg": { s: 3.3863886666667e+3, d: PRSR_DIMENSIONS },
        // "inH2O": { s: 2.4908891e+2, d: PRSR_DIMENSIONS },
        // "ftHg": { s: 4.0636664e+4, d: PRSR_DIMENSIONS },
        // "ftH2O": { s: 2.98906692e+3, d: PRSR_DIMENSIONS },
        /** Barye: CGS standard unit for pressure */
        // "Ba": { s: 1e-1, d: PRSR_DIMENSIONS },
        /** Gauge Pascal: Pascal with a zero offset at atmospheric pressure */
        // "Pa-g": { s: 1e+0, d: PRSR_DIMENSIONS, offset: 1.01325e+5 },
        // "bar-g": { s: 1e+5, d: PRSR_DIMENSIONS, offset: 1.01325e+5 },
        // "psi-g": { s: 6.89475729316836e+3, d: PRSR_DIMENSIONS, offset: 1.01325e+5},

        // Force

        /** Newtons */
        "N": { s: 1e+0, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]), prefixable: true },
        // "dyn": { s: 1e-5, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]) },
        /** Gram Force: the amount of force exerted by standard gravity on a 1 gram mass */
        // "gf": { s: 9.80665e-3, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]) },
        // "pond": { s: 9.80665e-3, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]) },
        /** Pound Force */
        // "lbf": { s: 4.4482216152605e+0, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]) },
        // "ozf": { s: 2.78013850953781e-1, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]) },
        // "pdl": { s: 1.38254954376e-1, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]) },
        // "ton-force": { s: 8.896443230521e+3, d: new Dimensions([1, 1, -2, 0, 0, 0, 0, 0]) },

        // Energy

        /** Joules */
        "J": { s: 1e+0, d: NRGY_DIMENSIONS, prefixable: true },
        /** electronvolt */
        "eV": { s: 1.602176634e-19, d: NRGY_DIMENSIONS, prefixable: true }, // 2019 definition, see https://physics.nist.gov/cgi-bin/cuu/Value?evj or Wikipedia
        // "erg": { s: 1e-7, d: NRGY_DIMENSIONS },
        /** Calorie */
        // "cal": { s: 4.1868, d: NRGY_DIMENSIONS },
        /** Kilo-calorie, commonly called simply "Calorie", used to measure energy in food in the US. */
        // "Cal": { s: 4.1868e+3, d: NRGY_DIMENSIONS },
        /** British Thermal Unit (IT definition). BTU is an ambiguous unit so is not recommended. */
        "BTU": { s: 1.05505585e+3, d: NRGY_DIMENSIONS },
        // "thm": { s: 1.05505585e+8, d: NRGY_DIMENSIONS },
        "Wh": { s: 3.6e+3, d: NRGY_DIMENSIONS, prefixable: true },
        // "HPh": { s: 2.68451953769617e+6, d: NRGY_DIMENSIONS },
        // "ft-lb": { s: 1.3558179483314e+0, d: NRGY_DIMENSIONS },
        // "ft-lbf": { s: 1.3558179483314e+0, d: NRGY_DIMENSIONS },

        // Insulation

        /** R-value, SI: thermal resistance per unit area */
        // "RSI": { s: 1e+0, d: new Dimensions([-1, 0, 3, 1, 0, 0, 0, 0]) },
        /** R-value, Inch-Pound: thermal resistance per unit area */
        // "RIP": { s: 1.7611018368230189e-1, d: new Dimensions([-1, 0, 3, 1, 0, 0, 0, 0]) },
        // "clo": { s: 1.55e-1, d: new Dimensions([-1, 0, 3, 1, 0, 0, 0, 0]) },
        // "tog": { s: 1e-1, d: new Dimensions([-1, 0, 3, 1, 0, 0, 0, 0]) },

        // Power

        /** Watts */
        "W": { s: 1e+0, d: POWR_DIMENSIONS, prefixable: true },
        /** Metric horsepower */
        // "PS": { s: 7.3549875e+2, d: POWR_DIMENSIONS },
        /** Mechanical Horsepower - Defined as 33 000 ft lbf / min */
        "HP": { s: 7.4569987158227e+2, d: POWR_DIMENSIONS },

        /** Poise (CGS unit for dynamic viscosity); recommend use of pascal-second (Pa⋅s) instead. */
        // "P": { s: 1e-1, d: new Dimensions([1, -1, -1, 0, 0, 0, 0, 0]) },
        /** Rhe: CGS unit for fluidity, equal to exactly 1 P^-1 */
        // "rhe": { s: 1e+1, d: new Dimensions([-1, 1, 1, 0, 0, 0, 0, 0]) },
        /** Stokes: CGS unit for kinematic viscosity */
        // "St": { s: 1e-4, d: new Dimensions([0, 2, -1, 0, 0, 0, 0, 0]) },

        // Volume:

        /** Litres */
        "L": { s: 1e-3, d: VOLM_DIMENSIONS, prefixable: true },
        // "tsp": { s: 4.92892159375e-6, d: VOLM_DIMENSIONS },
        // "tspm": { s: 5e-6, d: VOLM_DIMENSIONS },
        // "tbs": { s: 1.478676478125e-5, d: VOLM_DIMENSIONS },
        // "fl_oz": { s: 2.95735295625e-5, d: VOLM_DIMENSIONS },
        // "uk_fl_oz": { s: 2.84130625e-5, d: VOLM_DIMENSIONS },
        // "cup": { s: 2.365882365e-4, d: VOLM_DIMENSIONS },
        // "pt": { s: 4.73176473e-4, d: VOLM_DIMENSIONS },
        // "uk_pt": { s: 5.6826125e-4, d: VOLM_DIMENSIONS },
        // "qt": { s: 9.46352946e-4, d: VOLM_DIMENSIONS },
        // "uk_qt": { s: 1.1365225e-3, d: VOLM_DIMENSIONS },
        // "gal": { s: 3.785411784e-3, d: VOLM_DIMENSIONS },
        // "uk_gal": { s: 4.54609e-3, d: VOLM_DIMENSIONS },
        // "bushel": { s: 3.523907016688e-2, d: VOLM_DIMENSIONS },
        // "bbl": { s: 1.58987294928e-1, d: VOLM_DIMENSIONS },
        // "oilbarrel": { s: 1.58987294928e-1, d: VOLM_DIMENSIONS },
        // "beerbarrel": { s: 1.17347765304e-1, d: VOLM_DIMENSIONS },
        // "uk_beerbarrel": { s: 1.6365924e-1, d: VOLM_DIMENSIONS },
        // "MTON": { s: 1.13267386368e+0, d: VOLM_DIMENSIONS },
        // "GRT": { s: 2.8316846592e+0, d: VOLM_DIMENSIONS },
        // "gill": { s: 1.1829411825e-4, d: VOLM_DIMENSIONS },
        // "uk_gill": { s: 1.420653125e-4, d: VOLM_DIMENSIONS },
        // "peck": { s: 8.80976754172e-3, d: VOLM_DIMENSIONS },
        // "dry_gal": { s: 4.40488377086e-3, d: VOLM_DIMENSIONS },
        // "dry_qt": { s: 1.101220942715e-3, d: VOLM_DIMENSIONS },
        // "dry_pt": { s: 5.506104713575e-4, d: VOLM_DIMENSIONS },
        // "stere": { s: 1e+0, d: VOLM_DIMENSIONS },

        // "ar": { s: 1e+2, d: AREA_DIMENSIONS },
        // "morgen": { s: 2.5e+3, d: AREA_DIMENSIONS },
        // "acre": { s: 4.04687260987425e+3, d: AREA_DIMENSIONS },
        // "us_acre": { s: 4.04687260987425e+3, d: AREA_DIMENSIONS },
        // "uk_acre": { s: 4.0468564224e+3, d: AREA_DIMENSIONS },
        /** hectare: non-SI metric unit of area equal to a square with 100-metre sides */
        "ha": { s: 1e+4, d: AREA_DIMENSIONS },
        // "barn": { s: 1e-28, d: AREA_DIMENSIONS },

        // Information

        /** bit */
        "b": { s: 1, d: INFO_DIMENSIONS, prefixable: true, binaryPrefixable: true },
        // "bit": { s: 1e+0, d: INFO_DIMENSIONS },
        /** byte */
        "B": { s: 8, d: INFO_DIMENSIONS, prefixable: true, binaryPrefixable: true },
        // "byte": { s: 8e+0, d: INFO_DIMENSIONS },
        // "word": { s: 1.6e+1, d: INFO_DIMENSIONS },
        // "dword": { s: 3.2e+1, d: INFO_DIMENSIONS },
        // "baud": { s: 1e+0, d: new Dimensions([0, 0, -1, 0, 0, 0, 0, 1]) },

        // Electromagnetism

        /** Ampere: SI standard unit for electric current, equal to 1 C/s */
        "A": { s: 1e+0, d: new Dimensions([0, 0, 0, 0, 1, 0, 0, 0]), prefixable: true },
        /** Coulomb: SI standard unit for electric charge */
        "C": { s: 1e+0, d: new Dimensions([0, 0, 1, 0, 1, 0, 0, 0]), prefixable: true },
        /** Amp Hour: Charge collected from 1 Amp over 1 hour */
        "Ah": { s: 3.6e+3, d: new Dimensions([0, 0, 1, 0, 1, 0, 0, 0]), prefixable: true },
        // "e": { s: 1.602176634e-19, d: new Dimensions([0, 0, 1, 0, 1, 0, 0, 0]) },
        /** Volt */
        "V": { s: 1, d: new Dimensions([1, 2, -3, 0, -1, 0, 0, 0]), prefixable: true },
        /** Ohm/Ω: Derived SI unit for electrical resistance */
        "ohm": { s: 1, d: new Dimensions([1, 2, -3, 0, -2, 0, 0, 0]) },
        /** Farad: Derived SI unit of electrical capacitance */
        "F": { s: 1e+0, d: new Dimensions([-1, -2, 4, 0, 2, 0, 0, 0]), prefixable: true },
        /** Henry: Derived SI unit for inductance */
        "H": { s: 1e+0, d: new Dimensions([1, 2, -2, 0, -2, 0, 0, 0]), prefixable: true },
        /** Siemens: Derived SI unit for electrical conductance, equal to 1 / ohm */
        "S": { s: 1e+0, d: new Dimensions([-1, -2, 3, 0, 2, 0, 0, 0]), prefixable: true },
        // "mho": { s: 1e+0, d: new Dimensions([-1, -2, 3, 0, 2, 0, 0, 0, 0]) },
        /** Weber: SI unit for magnetic flux defined as 1 kg m^2 / (s^2 A) */
        "Wb": { s: 1e+0, d: new Dimensions([1, 2, -2, 0, -1, 0, 0, 0]), prefixable: true },
        // "Mx": { s: 1e-8, d: new Dimensions([1, 2, -2, 0, -1, 0, 0, 0, 0]) },
        /** Tesla: SI unit for magnetic flux density defined as 1 Wb / m^2 */
        "T": { s: 1e+0, d: new Dimensions([1, 0, -2, 0, -1, 0, 0, 0]), prefixable: true },
        // "Gs": { s: 1e-4, d: new Dimensions([1, 0, -2, 0, -1, 0, 0, 0, 0]) },
        // "gs": { s: 1e-4, d: new Dimensions([1, 0, -2, 0, -1, 0, 0, 0, 0]) },
        // "Fr": { s: 3.3356409519815207e-10, d: new Dimensions([0, 0, 1, 0, 1, 0, 0, 0, 0]) },
        // "Gi": { s: 7.957747e-1, d: new Dimensions([0, 0, 0, 0, 1, 0, 0, 0, 0]) },
        // "Oe": { s: 7.957747154594767e+1, d: new Dimensions([0, -1, 0, 0, 1, 0, 0, 0, 0]) },
        /** Mole: SI standard unit for an amount of substance, defined as exactly 6.02214076e23 elementary entities (usually molecules) */
        "mol": { s: 1e+0, d: new Dimensions([0, 0, 0, 0, 0, 1, 0, 0]) },
        /** Molar Concentration: Amount of substance per Liter of solution */
        "M": { s: 1e+3, d: new Dimensions([0, -3, 0, 0, 0, 1, 0, 0]) },
        // "kat": { s: 1e+0, d: new Dimensions([0, 0, -1, 0, 0, 1, 0, 0]) },
        // "U": { s: 1.6666666666666667e-8, d: new Dimensions([0, 0, -1, 0, 0, 1, 0, 0]) },
        /** Candela */
        // "cd": { s: 1e+0, d: new Dimensions([0, 0, 0, 0, 0, 0, 1, 0]) },
        /** Lumen */
        // "lm": { s: 1e+0, d: new Dimensions([0, 0, 0, 0, 0, 0, 1, 0]) },
        /** Lux */
        // "lx": { s: 1e+0, d: new Dimensions([0, -2, 0, 0, 0, 0, 1, 0]) },
        // "footcandle": {
        //     "s": 1.0763910416709722e+1,
        //     "d": [0, -2, 0, 0, 0, 0, 1, 0],
        // },
        // "footlambert": {
        //     "s": 3.4262590996353905e+0,
        //     "d": [0, -2, 0, 0, 0, 0, 1, 0],
        // },
        // "lambert": { s: 3.183098861837907e+3, d: new Dimensions([0, -2, 0, 0, 0, 0, 1, 0]) },
        // "phot": { s: 1e+4, d: new Dimensions([0, -2, 0, 0, 0, 0, 1, 0]) },
        // "stilb": { s: 1e+4, d: new Dimensions([0, -2, 0, 0, 0, 0, 1, 0]) },
        // "rad": { s: 1e+0, d: new Dimensions([0, 0, 0, 0, 0, 0, 0, 0]) },
        // "sr": { s: 1e+0, d: new Dimensions([0, 0, 0, 0, 0, 0, 0, 0]) },
        // "rev": { s: 6.283185307179586e+0, d: new Dimensions([0, 0, 0, 0, 0, 0, 0, 0]) },
        // "deg": { s: 1.7453292519943295e-2, d: new Dimensions([0, 0, 0, 0, 0, 0, 0, 0]) },
        // "arcmin": { s: 2.908882086657216e-4, d: new Dimensions([0, 0, 0, 0, 0, 0, 0, 0]) },
        // "arcsec": { s: 4.84813681109536e-6, d: new Dimensions([0, 0, 0, 0, 0, 0, 0, 0]) },
        /** If the non-SI unit rpm is considered a unit of angular velocity and the word "revolution" is considered to mean 2π radians, then 1 rpm = 2π/60 rad/s */
        // "rpm" : {s: 1.0471975511965977e-1, "d": new Dimensions([0,0,-1,0,0,0,0,0])},
        /** If the non-SI unit rpm is considered a unit of frequency, then 1 rpm = 1/60 Hz (Wikipedia) */
        // "rpm": { s: 1/60, d: new Dimensions([0, 0, -1, 0, 0, 0, 0, 0]) },
        /** Hertz: Frequency defined as 1 (cycle or rotation) / sec */
        "Hz": { s: 1, d: new Dimensions([0, 0, -1, 0, 0, 0, 0, 0]), prefixable: true },
        // "Bq": { s: 1e+0, d: new Dimensions([0, 0, -1, 0, 0, 0, 0, 0]) },
        // "Gy": { s: 1e+0, d: new Dimensions([0, 2, -2, 0, 0, 0, 0, 0]) },
        // "Sv": { s: 1e+0, d: new Dimensions([0, 2, -2, 0, 0, 0, 0, 0]) },
        // "R": { s: 2.58e-4, d: new Dimensions([-1, 0, 1, 0, 1, 0, 0, 0]) },
        // "RAD": { s: 1e-2, d: new Dimensions([0, 2, -2, 0, 0, 0, 0, 0]) },
        // "rem": { s: 1e-2, d: new Dimensions([0, 2, -2, 0, 0, 0, 0, 0]) },
        // "Ci": { s: 3.7e+10, d: new Dimensions([0, 0, -1, 0, 0, 0, 0, 0]) },

        // Misc.

        /** pphpd: "passengers per hour per direction" (_pax/h⋅_dir) */
        pphpd: {
            s: 1 / 3600,
            d: new Dimensions([0, 0, -1, 0, 0, 0, 0, 0, -1, 1], ["dir", "pax"]),
        },
    } as const satisfies Record<string, Unit>,
);

/** A unit that the user wants to use. */
export interface PreferredUnit {
    /** The SI prefix of this unit, if any. e.g. the "k" (kilo) in "km" (kilometers) */
    prefix?: Prefix;
    /** The unit, e.g. "m" for meters or "_pax" for a custom "passengers" unit */
    unit: string;
}

/** The result of parsing a unit like "km^2" into its parts (prefix, unit, and power) */
export interface ParsedUnit {
    /** The SI prefix of this unit, if any. e.g. the "k" (kilo) in "km" (kilometers) */
    prefix?: Prefix;
    /** The unit, e.g. "m" for meters or "_pax" for a custom "passengers" unit */
    unit: string;
    /** The power (exponent) to which the unit is raised. Often this is just 1. */
    power: number;
}

/** The base SI units. */
export const baseSIUnits: readonly PreferredUnit[] = Object.freeze([
    // Base units:
    { unit: "g", prefix: "k" },
    { unit: "m" },
    { unit: "s" },
    { unit: "K" },
    { unit: "A" },
    { unit: "mol" },
    // {unit: "cd"},
    { unit: "b" },
    // Derived units:
    { unit: "N" },
    { unit: "Pa" },
    { unit: "J" },
    { unit: "W" },
    { unit: "C" },
    { unit: "V" },
    { unit: "F" },
    { unit: "ohm" },
    { unit: "S" },
    { unit: "Wb" },
    { unit: "T" },
    { unit: "H" },
    // {unit: "lm"},
    // {unit: "lx"},
    // {unit: "Bq"},
    // {unit: "Gy"},
]);

/**
 * Parse a single unit string, e.g. "km^2" -> {prefix: "k", unit: "m", power: 2}
 *
 * This cannot parse compound units like "kg⋅m/s" or "m/s".
 * @param unitStr
 */
function parseSingleUnit(
    unitStr: string,
    additionalUnits?: Readonly<Record<string, Unit>>,
): ParsedUnit {
    const units: Record<string, Unit> = additionalUnits ? { ...builtInUnits, ...additionalUnits } : builtInUnits;

    const caretPos = unitStr.indexOf("^");
    // prefixedUnit: The unit possibly with a prefix, e.g. "km", "m", or "Kibit"
    const prefixedUnit = caretPos === -1 ? unitStr : unitStr.substring(0, caretPos);
    const power = caretPos === -1 ? 1 : Number(unitStr.substring(caretPos + 1));

    if (power === 0 || !Number.isInteger(power)) { // If power is 0 or NaN or a float:
        throw new QuantityError(`Invalid exponent/power on unit "${unitStr}"`);
    }

    if (prefixedUnit in units) {
        // Easiest case: unit exists and is ready to use
        return { unit: prefixedUnit, power };
    } else if (prefixedUnit[0] === "_") {
        // This represents a base unit in a custom dimension.
        // e.g. "_pax" is a custom unit with dimensionality of 1 in the "pax" dimension.
        return { unit: prefixedUnit, power };
    } else {
        // Try some prefixes:
        const firstLetter = prefixedUnit[0];
        let rest = prefixedUnit.substring(1);
        if (firstLetter in prefixes && units[rest]?.prefixable) {
            // prefixedUnit is a length 1 prefix and unit combined.
            return { prefix: firstLetter as Prefix, unit: rest, power };
        } else {
            const firstTwo = prefixedUnit.substring(0, 2);
            rest = prefixedUnit.substring(2);
            if (firstTwo in prefixes && units[rest]?.binaryPrefixable) {
                // prefixedUnit is a length 2 (binary) prefix like "Ki" and unit combined.
                return { prefix: firstTwo as Prefix, unit: rest, power };
            }
        }
    }
    throw new QuantityError(`Unable to parse the unit "${unitStr}"`);
}

const UNIT_SEPARATOR = /\s+|⋅/g;

/**
 * Parse a unit string, e.g. "km^2" or "kg⋅m/s^2" or "kg m / s^2"
 */
export function parseUnits(
    unitStr: string,
    additionalUnits?: Readonly<Record<string, Unit>>,
): ParsedUnit[] {
    const sections = unitStr.split("/");
    if (sections.length > 2) {
        throw new QuantityError(
            `Cannot parse a unit with 2 or more "/" symbols: got "${unitStr}"`,
        );
    }

    const numeratorParts = sections[0].trim().split(UNIT_SEPARATOR).map((
        part,
    ) => parseSingleUnit(part, additionalUnits));

    const denominatorParts = sections[1]?.trim().split(UNIT_SEPARATOR).map((
        part,
    ) => parseSingleUnit(part, additionalUnits));

    if (denominatorParts) {
        denominatorParts.forEach((x) => x.power *= -1);
        return numeratorParts.concat(denominatorParts);
    } else {
        return numeratorParts;
    }
}

/**
 * Convert a parsed unit array, e.g. from parseUnits(), back to a string like "kg⋅m/s^2"
 */
export function toUnitString(units: readonly ParsedUnit[]): string {
    const numerator: string[] = [];
    const denominator: string[] = [];
    for (const u of units) {
        if (u.power > 0) {
            numerator.push((u.prefix ?? "") + u.unit + (u.power !== 1 ? `^${u.power}` : ""));
        } else {
            denominator.push((u.prefix ?? "") + u.unit + (u.power !== -1 ? `^${(u.power * -1)}` : ""));
        }
    }
    if (denominator.length) {
        if (numerator.length) {
            return numerator.join("⋅") + "/" + denominator.join("⋅");
        } else {
            // Special rare case: If there's no numerator, just invert the denominator powers.
            return units.map((u) => (u.prefix ?? "") + u.unit + `^${u.power}`).join("⋅");
        }
    }
    return numerator.join("⋅");
}

export function getUnitData(unit: string, additionalUnits?: Readonly<Record<string, Unit>>): Unit {
    const found: Unit | undefined = builtInUnits[unit as keyof typeof builtInUnits] ?? additionalUnits?.[unit];
    if (found !== undefined) return found;
    if (unit.startsWith("_")) {
        // This is our shorthand notation for the base unit in a custom dimension.
        // e.g. "_pax" is a custom unit with dimensionality of 1 in the "pax" dimension.
        return { s: 1, d: new Dimensions([0, 0, 0, 0, 0, 0, 0, 0, 1], [unit.substring(1)]) };
    }
    throw new QuantityError(`Unknown/unsupported unit "${unit}"`);
}
