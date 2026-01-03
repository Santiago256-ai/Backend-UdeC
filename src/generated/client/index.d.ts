
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Empresa
 * 
 */
export type Empresa = $Result.DefaultSelection<Prisma.$EmpresaPayload>
/**
 * Model Vacante
 * 
 */
export type Vacante = $Result.DefaultSelection<Prisma.$VacantePayload>
/**
 * Model Postulacion
 * 
 */
export type Postulacion = $Result.DefaultSelection<Prisma.$PostulacionPayload>
/**
 * Model Mensaje
 * 
 */
export type Mensaje = $Result.DefaultSelection<Prisma.$MensajePayload>
/**
 * Model Notificacion
 * 
 */
export type Notificacion = $Result.DefaultSelection<Prisma.$NotificacionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.empresa`: Exposes CRUD operations for the **Empresa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Empresas
    * const empresas = await prisma.empresa.findMany()
    * ```
    */
  get empresa(): Prisma.EmpresaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vacante`: Exposes CRUD operations for the **Vacante** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vacantes
    * const vacantes = await prisma.vacante.findMany()
    * ```
    */
  get vacante(): Prisma.VacanteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.postulacion`: Exposes CRUD operations for the **Postulacion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Postulacions
    * const postulacions = await prisma.postulacion.findMany()
    * ```
    */
  get postulacion(): Prisma.PostulacionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mensaje`: Exposes CRUD operations for the **Mensaje** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mensajes
    * const mensajes = await prisma.mensaje.findMany()
    * ```
    */
  get mensaje(): Prisma.MensajeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notificacion`: Exposes CRUD operations for the **Notificacion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notificacions
    * const notificacions = await prisma.notificacion.findMany()
    * ```
    */
  get notificacion(): Prisma.NotificacionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.0
   * Query Engine version: c0aafc03b8ef6cdced8654b9a817999e02457d6a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Usuario: 'Usuario',
    Empresa: 'Empresa',
    Vacante: 'Vacante',
    Postulacion: 'Postulacion',
    Mensaje: 'Mensaje',
    Notificacion: 'Notificacion'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "usuario" | "empresa" | "vacante" | "postulacion" | "mensaje" | "notificacion"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Empresa: {
        payload: Prisma.$EmpresaPayload<ExtArgs>
        fields: Prisma.EmpresaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmpresaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmpresaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          findFirst: {
            args: Prisma.EmpresaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmpresaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          findMany: {
            args: Prisma.EmpresaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>[]
          }
          create: {
            args: Prisma.EmpresaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          createMany: {
            args: Prisma.EmpresaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmpresaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>[]
          }
          delete: {
            args: Prisma.EmpresaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          update: {
            args: Prisma.EmpresaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          deleteMany: {
            args: Prisma.EmpresaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmpresaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmpresaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>[]
          }
          upsert: {
            args: Prisma.EmpresaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          aggregate: {
            args: Prisma.EmpresaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmpresa>
          }
          groupBy: {
            args: Prisma.EmpresaGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmpresaGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmpresaCountArgs<ExtArgs>
            result: $Utils.Optional<EmpresaCountAggregateOutputType> | number
          }
        }
      }
      Vacante: {
        payload: Prisma.$VacantePayload<ExtArgs>
        fields: Prisma.VacanteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VacanteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VacanteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>
          }
          findFirst: {
            args: Prisma.VacanteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VacanteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>
          }
          findMany: {
            args: Prisma.VacanteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>[]
          }
          create: {
            args: Prisma.VacanteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>
          }
          createMany: {
            args: Prisma.VacanteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VacanteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>[]
          }
          delete: {
            args: Prisma.VacanteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>
          }
          update: {
            args: Prisma.VacanteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>
          }
          deleteMany: {
            args: Prisma.VacanteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VacanteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VacanteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>[]
          }
          upsert: {
            args: Prisma.VacanteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VacantePayload>
          }
          aggregate: {
            args: Prisma.VacanteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVacante>
          }
          groupBy: {
            args: Prisma.VacanteGroupByArgs<ExtArgs>
            result: $Utils.Optional<VacanteGroupByOutputType>[]
          }
          count: {
            args: Prisma.VacanteCountArgs<ExtArgs>
            result: $Utils.Optional<VacanteCountAggregateOutputType> | number
          }
        }
      }
      Postulacion: {
        payload: Prisma.$PostulacionPayload<ExtArgs>
        fields: Prisma.PostulacionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostulacionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostulacionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>
          }
          findFirst: {
            args: Prisma.PostulacionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostulacionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>
          }
          findMany: {
            args: Prisma.PostulacionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>[]
          }
          create: {
            args: Prisma.PostulacionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>
          }
          createMany: {
            args: Prisma.PostulacionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostulacionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>[]
          }
          delete: {
            args: Prisma.PostulacionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>
          }
          update: {
            args: Prisma.PostulacionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>
          }
          deleteMany: {
            args: Prisma.PostulacionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostulacionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostulacionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>[]
          }
          upsert: {
            args: Prisma.PostulacionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostulacionPayload>
          }
          aggregate: {
            args: Prisma.PostulacionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePostulacion>
          }
          groupBy: {
            args: Prisma.PostulacionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostulacionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostulacionCountArgs<ExtArgs>
            result: $Utils.Optional<PostulacionCountAggregateOutputType> | number
          }
        }
      }
      Mensaje: {
        payload: Prisma.$MensajePayload<ExtArgs>
        fields: Prisma.MensajeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MensajeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MensajeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>
          }
          findFirst: {
            args: Prisma.MensajeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MensajeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>
          }
          findMany: {
            args: Prisma.MensajeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>[]
          }
          create: {
            args: Prisma.MensajeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>
          }
          createMany: {
            args: Prisma.MensajeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MensajeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>[]
          }
          delete: {
            args: Prisma.MensajeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>
          }
          update: {
            args: Prisma.MensajeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>
          }
          deleteMany: {
            args: Prisma.MensajeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MensajeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MensajeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>[]
          }
          upsert: {
            args: Prisma.MensajeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensajePayload>
          }
          aggregate: {
            args: Prisma.MensajeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMensaje>
          }
          groupBy: {
            args: Prisma.MensajeGroupByArgs<ExtArgs>
            result: $Utils.Optional<MensajeGroupByOutputType>[]
          }
          count: {
            args: Prisma.MensajeCountArgs<ExtArgs>
            result: $Utils.Optional<MensajeCountAggregateOutputType> | number
          }
        }
      }
      Notificacion: {
        payload: Prisma.$NotificacionPayload<ExtArgs>
        fields: Prisma.NotificacionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificacionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificacionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>
          }
          findFirst: {
            args: Prisma.NotificacionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificacionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>
          }
          findMany: {
            args: Prisma.NotificacionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>[]
          }
          create: {
            args: Prisma.NotificacionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>
          }
          createMany: {
            args: Prisma.NotificacionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificacionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>[]
          }
          delete: {
            args: Prisma.NotificacionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>
          }
          update: {
            args: Prisma.NotificacionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>
          }
          deleteMany: {
            args: Prisma.NotificacionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificacionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificacionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>[]
          }
          upsert: {
            args: Prisma.NotificacionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificacionPayload>
          }
          aggregate: {
            args: Prisma.NotificacionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificacion>
          }
          groupBy: {
            args: Prisma.NotificacionGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificacionGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificacionCountArgs<ExtArgs>
            result: $Utils.Optional<NotificacionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    usuario?: UsuarioOmit
    empresa?: EmpresaOmit
    vacante?: VacanteOmit
    postulacion?: PostulacionOmit
    mensaje?: MensajeOmit
    notificacion?: NotificacionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsuarioCountOutputType
   */

  export type UsuarioCountOutputType = {
    postulaciones: number
    mensajesEnviados: number
    mensajesRecibidos: number
    notificaciones: number
  }

  export type UsuarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    postulaciones?: boolean | UsuarioCountOutputTypeCountPostulacionesArgs
    mensajesEnviados?: boolean | UsuarioCountOutputTypeCountMensajesEnviadosArgs
    mensajesRecibidos?: boolean | UsuarioCountOutputTypeCountMensajesRecibidosArgs
    notificaciones?: boolean | UsuarioCountOutputTypeCountNotificacionesArgs
  }

  // Custom InputTypes
  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioCountOutputType
     */
    select?: UsuarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountPostulacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostulacionWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountMensajesEnviadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MensajeWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountMensajesRecibidosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MensajeWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountNotificacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificacionWhereInput
  }


  /**
   * Count Type EmpresaCountOutputType
   */

  export type EmpresaCountOutputType = {
    vacantes: number
    mensajesEnviados: number
  }

  export type EmpresaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vacantes?: boolean | EmpresaCountOutputTypeCountVacantesArgs
    mensajesEnviados?: boolean | EmpresaCountOutputTypeCountMensajesEnviadosArgs
  }

  // Custom InputTypes
  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmpresaCountOutputType
     */
    select?: EmpresaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeCountVacantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VacanteWhereInput
  }

  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeCountMensajesEnviadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MensajeWhereInput
  }


  /**
   * Count Type VacanteCountOutputType
   */

  export type VacanteCountOutputType = {
    postulaciones: number
  }

  export type VacanteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    postulaciones?: boolean | VacanteCountOutputTypeCountPostulacionesArgs
  }

  // Custom InputTypes
  /**
   * VacanteCountOutputType without action
   */
  export type VacanteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VacanteCountOutputType
     */
    select?: VacanteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VacanteCountOutputType without action
   */
  export type VacanteCountOutputTypeCountPostulacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostulacionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    id: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    id: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: number | null
    nombres: string | null
    apellidos: string | null
    usuario: string | null
    correo: string | null
    password: string | null
    firebaseUid: string | null
    rol: string | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: number | null
    nombres: string | null
    apellidos: string | null
    usuario: string | null
    correo: string | null
    password: string | null
    firebaseUid: string | null
    rol: string | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    nombres: number
    apellidos: number
    usuario: number
    correo: number
    password: number
    firebaseUid: number
    rol: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    id?: true
  }

  export type UsuarioSumAggregateInputType = {
    id?: true
  }

  export type UsuarioMinAggregateInputType = {
    id?: true
    nombres?: true
    apellidos?: true
    usuario?: true
    correo?: true
    password?: true
    firebaseUid?: true
    rol?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    nombres?: true
    apellidos?: true
    usuario?: true
    correo?: true
    password?: true
    firebaseUid?: true
    rol?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    nombres?: true
    apellidos?: true
    usuario?: true
    correo?: true
    password?: true
    firebaseUid?: true
    rol?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: number
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password: string | null
    firebaseUid: string | null
    rol: string
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombres?: boolean
    apellidos?: boolean
    usuario?: boolean
    correo?: boolean
    password?: boolean
    firebaseUid?: boolean
    rol?: boolean
    postulaciones?: boolean | Usuario$postulacionesArgs<ExtArgs>
    mensajesEnviados?: boolean | Usuario$mensajesEnviadosArgs<ExtArgs>
    mensajesRecibidos?: boolean | Usuario$mensajesRecibidosArgs<ExtArgs>
    notificaciones?: boolean | Usuario$notificacionesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombres?: boolean
    apellidos?: boolean
    usuario?: boolean
    correo?: boolean
    password?: boolean
    firebaseUid?: boolean
    rol?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombres?: boolean
    apellidos?: boolean
    usuario?: boolean
    correo?: boolean
    password?: boolean
    firebaseUid?: boolean
    rol?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    nombres?: boolean
    apellidos?: boolean
    usuario?: boolean
    correo?: boolean
    password?: boolean
    firebaseUid?: boolean
    rol?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombres" | "apellidos" | "usuario" | "correo" | "password" | "firebaseUid" | "rol", ExtArgs["result"]["usuario"]>
  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    postulaciones?: boolean | Usuario$postulacionesArgs<ExtArgs>
    mensajesEnviados?: boolean | Usuario$mensajesEnviadosArgs<ExtArgs>
    mensajesRecibidos?: boolean | Usuario$mensajesRecibidosArgs<ExtArgs>
    notificaciones?: boolean | Usuario$notificacionesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      postulaciones: Prisma.$PostulacionPayload<ExtArgs>[]
      mensajesEnviados: Prisma.$MensajePayload<ExtArgs>[]
      mensajesRecibidos: Prisma.$MensajePayload<ExtArgs>[]
      notificaciones: Prisma.$NotificacionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombres: string
      apellidos: string
      usuario: string
      correo: string
      password: string | null
      firebaseUid: string | null
      rol: string
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    postulaciones<T extends Usuario$postulacionesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$postulacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mensajesEnviados<T extends Usuario$mensajesEnviadosArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$mensajesEnviadosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mensajesRecibidos<T extends Usuario$mensajesRecibidosArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$mensajesRecibidosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notificaciones<T extends Usuario$notificacionesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$notificacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'Int'>
    readonly nombres: FieldRef<"Usuario", 'String'>
    readonly apellidos: FieldRef<"Usuario", 'String'>
    readonly usuario: FieldRef<"Usuario", 'String'>
    readonly correo: FieldRef<"Usuario", 'String'>
    readonly password: FieldRef<"Usuario", 'String'>
    readonly firebaseUid: FieldRef<"Usuario", 'String'>
    readonly rol: FieldRef<"Usuario", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario.postulaciones
   */
  export type Usuario$postulacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    where?: PostulacionWhereInput
    orderBy?: PostulacionOrderByWithRelationInput | PostulacionOrderByWithRelationInput[]
    cursor?: PostulacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostulacionScalarFieldEnum | PostulacionScalarFieldEnum[]
  }

  /**
   * Usuario.mensajesEnviados
   */
  export type Usuario$mensajesEnviadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    where?: MensajeWhereInput
    orderBy?: MensajeOrderByWithRelationInput | MensajeOrderByWithRelationInput[]
    cursor?: MensajeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MensajeScalarFieldEnum | MensajeScalarFieldEnum[]
  }

  /**
   * Usuario.mensajesRecibidos
   */
  export type Usuario$mensajesRecibidosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    where?: MensajeWhereInput
    orderBy?: MensajeOrderByWithRelationInput | MensajeOrderByWithRelationInput[]
    cursor?: MensajeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MensajeScalarFieldEnum | MensajeScalarFieldEnum[]
  }

  /**
   * Usuario.notificaciones
   */
  export type Usuario$notificacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    where?: NotificacionWhereInput
    orderBy?: NotificacionOrderByWithRelationInput | NotificacionOrderByWithRelationInput[]
    cursor?: NotificacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificacionScalarFieldEnum | NotificacionScalarFieldEnum[]
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Empresa
   */

  export type AggregateEmpresa = {
    _count: EmpresaCountAggregateOutputType | null
    _avg: EmpresaAvgAggregateOutputType | null
    _sum: EmpresaSumAggregateOutputType | null
    _min: EmpresaMinAggregateOutputType | null
    _max: EmpresaMaxAggregateOutputType | null
  }

  export type EmpresaAvgAggregateOutputType = {
    id: number | null
    foundationYear: number | null
  }

  export type EmpresaSumAggregateOutputType = {
    id: number | null
    foundationYear: number | null
  }

  export type EmpresaMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    nombre: string | null
    phones: string | null
    contactName: string | null
    nit: string | null
    address: string | null
    city: string | null
    department: string | null
    companyType: string | null
    foundationYear: number | null
    employees: string | null
    annualRevenue: string | null
    totalAssets: string | null
    equity: string | null
    mainClients: string | null
    emailAuthorization: boolean | null
    createdAt: Date | null
  }

  export type EmpresaMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    nombre: string | null
    phones: string | null
    contactName: string | null
    nit: string | null
    address: string | null
    city: string | null
    department: string | null
    companyType: string | null
    foundationYear: number | null
    employees: string | null
    annualRevenue: string | null
    totalAssets: string | null
    equity: string | null
    mainClients: string | null
    emailAuthorization: boolean | null
    createdAt: Date | null
  }

  export type EmpresaCountAggregateOutputType = {
    id: number
    email: number
    password: number
    nombre: number
    phones: number
    contactName: number
    nit: number
    address: number
    city: number
    department: number
    companyType: number
    economicSector: number
    foundationYear: number
    employees: number
    annualRevenue: number
    totalAssets: number
    equity: number
    distributionChannels: number
    mainClients: number
    emailAuthorization: number
    createdAt: number
    _all: number
  }


  export type EmpresaAvgAggregateInputType = {
    id?: true
    foundationYear?: true
  }

  export type EmpresaSumAggregateInputType = {
    id?: true
    foundationYear?: true
  }

  export type EmpresaMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nombre?: true
    phones?: true
    contactName?: true
    nit?: true
    address?: true
    city?: true
    department?: true
    companyType?: true
    foundationYear?: true
    employees?: true
    annualRevenue?: true
    totalAssets?: true
    equity?: true
    mainClients?: true
    emailAuthorization?: true
    createdAt?: true
  }

  export type EmpresaMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nombre?: true
    phones?: true
    contactName?: true
    nit?: true
    address?: true
    city?: true
    department?: true
    companyType?: true
    foundationYear?: true
    employees?: true
    annualRevenue?: true
    totalAssets?: true
    equity?: true
    mainClients?: true
    emailAuthorization?: true
    createdAt?: true
  }

  export type EmpresaCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nombre?: true
    phones?: true
    contactName?: true
    nit?: true
    address?: true
    city?: true
    department?: true
    companyType?: true
    economicSector?: true
    foundationYear?: true
    employees?: true
    annualRevenue?: true
    totalAssets?: true
    equity?: true
    distributionChannels?: true
    mainClients?: true
    emailAuthorization?: true
    createdAt?: true
    _all?: true
  }

  export type EmpresaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Empresa to aggregate.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Empresas
    **/
    _count?: true | EmpresaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmpresaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmpresaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmpresaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmpresaMaxAggregateInputType
  }

  export type GetEmpresaAggregateType<T extends EmpresaAggregateArgs> = {
        [P in keyof T & keyof AggregateEmpresa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmpresa[P]>
      : GetScalarType<T[P], AggregateEmpresa[P]>
  }




  export type EmpresaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmpresaWhereInput
    orderBy?: EmpresaOrderByWithAggregationInput | EmpresaOrderByWithAggregationInput[]
    by: EmpresaScalarFieldEnum[] | EmpresaScalarFieldEnum
    having?: EmpresaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmpresaCountAggregateInputType | true
    _avg?: EmpresaAvgAggregateInputType
    _sum?: EmpresaSumAggregateInputType
    _min?: EmpresaMinAggregateInputType
    _max?: EmpresaMaxAggregateInputType
  }

  export type EmpresaGroupByOutputType = {
    id: number
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector: string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets: string | null
    equity: string | null
    distributionChannels: string[]
    mainClients: string
    emailAuthorization: boolean
    createdAt: Date
    _count: EmpresaCountAggregateOutputType | null
    _avg: EmpresaAvgAggregateOutputType | null
    _sum: EmpresaSumAggregateOutputType | null
    _min: EmpresaMinAggregateOutputType | null
    _max: EmpresaMaxAggregateOutputType | null
  }

  type GetEmpresaGroupByPayload<T extends EmpresaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmpresaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmpresaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmpresaGroupByOutputType[P]>
            : GetScalarType<T[P], EmpresaGroupByOutputType[P]>
        }
      >
    >


  export type EmpresaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nombre?: boolean
    phones?: boolean
    contactName?: boolean
    nit?: boolean
    address?: boolean
    city?: boolean
    department?: boolean
    companyType?: boolean
    economicSector?: boolean
    foundationYear?: boolean
    employees?: boolean
    annualRevenue?: boolean
    totalAssets?: boolean
    equity?: boolean
    distributionChannels?: boolean
    mainClients?: boolean
    emailAuthorization?: boolean
    createdAt?: boolean
    vacantes?: boolean | Empresa$vacantesArgs<ExtArgs>
    mensajesEnviados?: boolean | Empresa$mensajesEnviadosArgs<ExtArgs>
    _count?: boolean | EmpresaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["empresa"]>

  export type EmpresaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nombre?: boolean
    phones?: boolean
    contactName?: boolean
    nit?: boolean
    address?: boolean
    city?: boolean
    department?: boolean
    companyType?: boolean
    economicSector?: boolean
    foundationYear?: boolean
    employees?: boolean
    annualRevenue?: boolean
    totalAssets?: boolean
    equity?: boolean
    distributionChannels?: boolean
    mainClients?: boolean
    emailAuthorization?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["empresa"]>

  export type EmpresaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nombre?: boolean
    phones?: boolean
    contactName?: boolean
    nit?: boolean
    address?: boolean
    city?: boolean
    department?: boolean
    companyType?: boolean
    economicSector?: boolean
    foundationYear?: boolean
    employees?: boolean
    annualRevenue?: boolean
    totalAssets?: boolean
    equity?: boolean
    distributionChannels?: boolean
    mainClients?: boolean
    emailAuthorization?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["empresa"]>

  export type EmpresaSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    nombre?: boolean
    phones?: boolean
    contactName?: boolean
    nit?: boolean
    address?: boolean
    city?: boolean
    department?: boolean
    companyType?: boolean
    economicSector?: boolean
    foundationYear?: boolean
    employees?: boolean
    annualRevenue?: boolean
    totalAssets?: boolean
    equity?: boolean
    distributionChannels?: boolean
    mainClients?: boolean
    emailAuthorization?: boolean
    createdAt?: boolean
  }

  export type EmpresaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "nombre" | "phones" | "contactName" | "nit" | "address" | "city" | "department" | "companyType" | "economicSector" | "foundationYear" | "employees" | "annualRevenue" | "totalAssets" | "equity" | "distributionChannels" | "mainClients" | "emailAuthorization" | "createdAt", ExtArgs["result"]["empresa"]>
  export type EmpresaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vacantes?: boolean | Empresa$vacantesArgs<ExtArgs>
    mensajesEnviados?: boolean | Empresa$mensajesEnviadosArgs<ExtArgs>
    _count?: boolean | EmpresaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EmpresaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EmpresaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EmpresaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Empresa"
    objects: {
      vacantes: Prisma.$VacantePayload<ExtArgs>[]
      mensajesEnviados: Prisma.$MensajePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      password: string
      nombre: string
      phones: string
      contactName: string
      nit: string | null
      address: string
      city: string
      department: string
      companyType: string
      economicSector: string[]
      foundationYear: number
      employees: string
      annualRevenue: string
      totalAssets: string | null
      equity: string | null
      distributionChannels: string[]
      mainClients: string
      emailAuthorization: boolean
      createdAt: Date
    }, ExtArgs["result"]["empresa"]>
    composites: {}
  }

  type EmpresaGetPayload<S extends boolean | null | undefined | EmpresaDefaultArgs> = $Result.GetResult<Prisma.$EmpresaPayload, S>

  type EmpresaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmpresaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmpresaCountAggregateInputType | true
    }

  export interface EmpresaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Empresa'], meta: { name: 'Empresa' } }
    /**
     * Find zero or one Empresa that matches the filter.
     * @param {EmpresaFindUniqueArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmpresaFindUniqueArgs>(args: SelectSubset<T, EmpresaFindUniqueArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Empresa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmpresaFindUniqueOrThrowArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmpresaFindUniqueOrThrowArgs>(args: SelectSubset<T, EmpresaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Empresa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindFirstArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmpresaFindFirstArgs>(args?: SelectSubset<T, EmpresaFindFirstArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Empresa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindFirstOrThrowArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmpresaFindFirstOrThrowArgs>(args?: SelectSubset<T, EmpresaFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Empresas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Empresas
     * const empresas = await prisma.empresa.findMany()
     * 
     * // Get first 10 Empresas
     * const empresas = await prisma.empresa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const empresaWithIdOnly = await prisma.empresa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmpresaFindManyArgs>(args?: SelectSubset<T, EmpresaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Empresa.
     * @param {EmpresaCreateArgs} args - Arguments to create a Empresa.
     * @example
     * // Create one Empresa
     * const Empresa = await prisma.empresa.create({
     *   data: {
     *     // ... data to create a Empresa
     *   }
     * })
     * 
     */
    create<T extends EmpresaCreateArgs>(args: SelectSubset<T, EmpresaCreateArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Empresas.
     * @param {EmpresaCreateManyArgs} args - Arguments to create many Empresas.
     * @example
     * // Create many Empresas
     * const empresa = await prisma.empresa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmpresaCreateManyArgs>(args?: SelectSubset<T, EmpresaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Empresas and returns the data saved in the database.
     * @param {EmpresaCreateManyAndReturnArgs} args - Arguments to create many Empresas.
     * @example
     * // Create many Empresas
     * const empresa = await prisma.empresa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Empresas and only return the `id`
     * const empresaWithIdOnly = await prisma.empresa.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmpresaCreateManyAndReturnArgs>(args?: SelectSubset<T, EmpresaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Empresa.
     * @param {EmpresaDeleteArgs} args - Arguments to delete one Empresa.
     * @example
     * // Delete one Empresa
     * const Empresa = await prisma.empresa.delete({
     *   where: {
     *     // ... filter to delete one Empresa
     *   }
     * })
     * 
     */
    delete<T extends EmpresaDeleteArgs>(args: SelectSubset<T, EmpresaDeleteArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Empresa.
     * @param {EmpresaUpdateArgs} args - Arguments to update one Empresa.
     * @example
     * // Update one Empresa
     * const empresa = await prisma.empresa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmpresaUpdateArgs>(args: SelectSubset<T, EmpresaUpdateArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Empresas.
     * @param {EmpresaDeleteManyArgs} args - Arguments to filter Empresas to delete.
     * @example
     * // Delete a few Empresas
     * const { count } = await prisma.empresa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmpresaDeleteManyArgs>(args?: SelectSubset<T, EmpresaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Empresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Empresas
     * const empresa = await prisma.empresa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmpresaUpdateManyArgs>(args: SelectSubset<T, EmpresaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Empresas and returns the data updated in the database.
     * @param {EmpresaUpdateManyAndReturnArgs} args - Arguments to update many Empresas.
     * @example
     * // Update many Empresas
     * const empresa = await prisma.empresa.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Empresas and only return the `id`
     * const empresaWithIdOnly = await prisma.empresa.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EmpresaUpdateManyAndReturnArgs>(args: SelectSubset<T, EmpresaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Empresa.
     * @param {EmpresaUpsertArgs} args - Arguments to update or create a Empresa.
     * @example
     * // Update or create a Empresa
     * const empresa = await prisma.empresa.upsert({
     *   create: {
     *     // ... data to create a Empresa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Empresa we want to update
     *   }
     * })
     */
    upsert<T extends EmpresaUpsertArgs>(args: SelectSubset<T, EmpresaUpsertArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Empresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaCountArgs} args - Arguments to filter Empresas to count.
     * @example
     * // Count the number of Empresas
     * const count = await prisma.empresa.count({
     *   where: {
     *     // ... the filter for the Empresas we want to count
     *   }
     * })
    **/
    count<T extends EmpresaCountArgs>(
      args?: Subset<T, EmpresaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmpresaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Empresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmpresaAggregateArgs>(args: Subset<T, EmpresaAggregateArgs>): Prisma.PrismaPromise<GetEmpresaAggregateType<T>>

    /**
     * Group by Empresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmpresaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmpresaGroupByArgs['orderBy'] }
        : { orderBy?: EmpresaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmpresaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmpresaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Empresa model
   */
  readonly fields: EmpresaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Empresa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmpresaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vacantes<T extends Empresa$vacantesArgs<ExtArgs> = {}>(args?: Subset<T, Empresa$vacantesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mensajesEnviados<T extends Empresa$mensajesEnviadosArgs<ExtArgs> = {}>(args?: Subset<T, Empresa$mensajesEnviadosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Empresa model
   */
  interface EmpresaFieldRefs {
    readonly id: FieldRef<"Empresa", 'Int'>
    readonly email: FieldRef<"Empresa", 'String'>
    readonly password: FieldRef<"Empresa", 'String'>
    readonly nombre: FieldRef<"Empresa", 'String'>
    readonly phones: FieldRef<"Empresa", 'String'>
    readonly contactName: FieldRef<"Empresa", 'String'>
    readonly nit: FieldRef<"Empresa", 'String'>
    readonly address: FieldRef<"Empresa", 'String'>
    readonly city: FieldRef<"Empresa", 'String'>
    readonly department: FieldRef<"Empresa", 'String'>
    readonly companyType: FieldRef<"Empresa", 'String'>
    readonly economicSector: FieldRef<"Empresa", 'String[]'>
    readonly foundationYear: FieldRef<"Empresa", 'Int'>
    readonly employees: FieldRef<"Empresa", 'String'>
    readonly annualRevenue: FieldRef<"Empresa", 'String'>
    readonly totalAssets: FieldRef<"Empresa", 'String'>
    readonly equity: FieldRef<"Empresa", 'String'>
    readonly distributionChannels: FieldRef<"Empresa", 'String[]'>
    readonly mainClients: FieldRef<"Empresa", 'String'>
    readonly emailAuthorization: FieldRef<"Empresa", 'Boolean'>
    readonly createdAt: FieldRef<"Empresa", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Empresa findUnique
   */
  export type EmpresaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa findUniqueOrThrow
   */
  export type EmpresaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa findFirst
   */
  export type EmpresaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Empresas.
     */
    distinct?: EmpresaScalarFieldEnum | EmpresaScalarFieldEnum[]
  }

  /**
   * Empresa findFirstOrThrow
   */
  export type EmpresaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Empresas.
     */
    distinct?: EmpresaScalarFieldEnum | EmpresaScalarFieldEnum[]
  }

  /**
   * Empresa findMany
   */
  export type EmpresaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresas to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    distinct?: EmpresaScalarFieldEnum | EmpresaScalarFieldEnum[]
  }

  /**
   * Empresa create
   */
  export type EmpresaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The data needed to create a Empresa.
     */
    data: XOR<EmpresaCreateInput, EmpresaUncheckedCreateInput>
  }

  /**
   * Empresa createMany
   */
  export type EmpresaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Empresas.
     */
    data: EmpresaCreateManyInput | EmpresaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Empresa createManyAndReturn
   */
  export type EmpresaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * The data used to create many Empresas.
     */
    data: EmpresaCreateManyInput | EmpresaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Empresa update
   */
  export type EmpresaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The data needed to update a Empresa.
     */
    data: XOR<EmpresaUpdateInput, EmpresaUncheckedUpdateInput>
    /**
     * Choose, which Empresa to update.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa updateMany
   */
  export type EmpresaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Empresas.
     */
    data: XOR<EmpresaUpdateManyMutationInput, EmpresaUncheckedUpdateManyInput>
    /**
     * Filter which Empresas to update
     */
    where?: EmpresaWhereInput
    /**
     * Limit how many Empresas to update.
     */
    limit?: number
  }

  /**
   * Empresa updateManyAndReturn
   */
  export type EmpresaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * The data used to update Empresas.
     */
    data: XOR<EmpresaUpdateManyMutationInput, EmpresaUncheckedUpdateManyInput>
    /**
     * Filter which Empresas to update
     */
    where?: EmpresaWhereInput
    /**
     * Limit how many Empresas to update.
     */
    limit?: number
  }

  /**
   * Empresa upsert
   */
  export type EmpresaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The filter to search for the Empresa to update in case it exists.
     */
    where: EmpresaWhereUniqueInput
    /**
     * In case the Empresa found by the `where` argument doesn't exist, create a new Empresa with this data.
     */
    create: XOR<EmpresaCreateInput, EmpresaUncheckedCreateInput>
    /**
     * In case the Empresa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmpresaUpdateInput, EmpresaUncheckedUpdateInput>
  }

  /**
   * Empresa delete
   */
  export type EmpresaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter which Empresa to delete.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa deleteMany
   */
  export type EmpresaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Empresas to delete
     */
    where?: EmpresaWhereInput
    /**
     * Limit how many Empresas to delete.
     */
    limit?: number
  }

  /**
   * Empresa.vacantes
   */
  export type Empresa$vacantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    where?: VacanteWhereInput
    orderBy?: VacanteOrderByWithRelationInput | VacanteOrderByWithRelationInput[]
    cursor?: VacanteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VacanteScalarFieldEnum | VacanteScalarFieldEnum[]
  }

  /**
   * Empresa.mensajesEnviados
   */
  export type Empresa$mensajesEnviadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    where?: MensajeWhereInput
    orderBy?: MensajeOrderByWithRelationInput | MensajeOrderByWithRelationInput[]
    cursor?: MensajeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MensajeScalarFieldEnum | MensajeScalarFieldEnum[]
  }

  /**
   * Empresa without action
   */
  export type EmpresaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
  }


  /**
   * Model Vacante
   */

  export type AggregateVacante = {
    _count: VacanteCountAggregateOutputType | null
    _avg: VacanteAvgAggregateOutputType | null
    _sum: VacanteSumAggregateOutputType | null
    _min: VacanteMinAggregateOutputType | null
    _max: VacanteMaxAggregateOutputType | null
  }

  export type VacanteAvgAggregateOutputType = {
    id: number | null
    empresaId: number | null
  }

  export type VacanteSumAggregateOutputType = {
    id: number | null
    empresaId: number | null
  }

  export type VacanteMinAggregateOutputType = {
    id: number | null
    titulo: string | null
    descripcion: string | null
    ubicacion: string | null
    tipo: string | null
    modalidad: string | null
    salario: string | null
    fechaCreacion: Date | null
    empresaId: number | null
  }

  export type VacanteMaxAggregateOutputType = {
    id: number | null
    titulo: string | null
    descripcion: string | null
    ubicacion: string | null
    tipo: string | null
    modalidad: string | null
    salario: string | null
    fechaCreacion: Date | null
    empresaId: number | null
  }

  export type VacanteCountAggregateOutputType = {
    id: number
    titulo: number
    descripcion: number
    ubicacion: number
    tipo: number
    modalidad: number
    salario: number
    fechaCreacion: number
    empresaId: number
    _all: number
  }


  export type VacanteAvgAggregateInputType = {
    id?: true
    empresaId?: true
  }

  export type VacanteSumAggregateInputType = {
    id?: true
    empresaId?: true
  }

  export type VacanteMinAggregateInputType = {
    id?: true
    titulo?: true
    descripcion?: true
    ubicacion?: true
    tipo?: true
    modalidad?: true
    salario?: true
    fechaCreacion?: true
    empresaId?: true
  }

  export type VacanteMaxAggregateInputType = {
    id?: true
    titulo?: true
    descripcion?: true
    ubicacion?: true
    tipo?: true
    modalidad?: true
    salario?: true
    fechaCreacion?: true
    empresaId?: true
  }

  export type VacanteCountAggregateInputType = {
    id?: true
    titulo?: true
    descripcion?: true
    ubicacion?: true
    tipo?: true
    modalidad?: true
    salario?: true
    fechaCreacion?: true
    empresaId?: true
    _all?: true
  }

  export type VacanteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vacante to aggregate.
     */
    where?: VacanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vacantes to fetch.
     */
    orderBy?: VacanteOrderByWithRelationInput | VacanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VacanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vacantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vacantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vacantes
    **/
    _count?: true | VacanteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VacanteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VacanteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VacanteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VacanteMaxAggregateInputType
  }

  export type GetVacanteAggregateType<T extends VacanteAggregateArgs> = {
        [P in keyof T & keyof AggregateVacante]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVacante[P]>
      : GetScalarType<T[P], AggregateVacante[P]>
  }




  export type VacanteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VacanteWhereInput
    orderBy?: VacanteOrderByWithAggregationInput | VacanteOrderByWithAggregationInput[]
    by: VacanteScalarFieldEnum[] | VacanteScalarFieldEnum
    having?: VacanteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VacanteCountAggregateInputType | true
    _avg?: VacanteAvgAggregateInputType
    _sum?: VacanteSumAggregateInputType
    _min?: VacanteMinAggregateInputType
    _max?: VacanteMaxAggregateInputType
  }

  export type VacanteGroupByOutputType = {
    id: number
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario: string | null
    fechaCreacion: Date
    empresaId: number
    _count: VacanteCountAggregateOutputType | null
    _avg: VacanteAvgAggregateOutputType | null
    _sum: VacanteSumAggregateOutputType | null
    _min: VacanteMinAggregateOutputType | null
    _max: VacanteMaxAggregateOutputType | null
  }

  type GetVacanteGroupByPayload<T extends VacanteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VacanteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VacanteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VacanteGroupByOutputType[P]>
            : GetScalarType<T[P], VacanteGroupByOutputType[P]>
        }
      >
    >


  export type VacanteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    descripcion?: boolean
    ubicacion?: boolean
    tipo?: boolean
    modalidad?: boolean
    salario?: boolean
    fechaCreacion?: boolean
    empresaId?: boolean
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
    postulaciones?: boolean | Vacante$postulacionesArgs<ExtArgs>
    _count?: boolean | VacanteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vacante"]>

  export type VacanteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    descripcion?: boolean
    ubicacion?: boolean
    tipo?: boolean
    modalidad?: boolean
    salario?: boolean
    fechaCreacion?: boolean
    empresaId?: boolean
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vacante"]>

  export type VacanteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    descripcion?: boolean
    ubicacion?: boolean
    tipo?: boolean
    modalidad?: boolean
    salario?: boolean
    fechaCreacion?: boolean
    empresaId?: boolean
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vacante"]>

  export type VacanteSelectScalar = {
    id?: boolean
    titulo?: boolean
    descripcion?: boolean
    ubicacion?: boolean
    tipo?: boolean
    modalidad?: boolean
    salario?: boolean
    fechaCreacion?: boolean
    empresaId?: boolean
  }

  export type VacanteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "titulo" | "descripcion" | "ubicacion" | "tipo" | "modalidad" | "salario" | "fechaCreacion" | "empresaId", ExtArgs["result"]["vacante"]>
  export type VacanteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
    postulaciones?: boolean | Vacante$postulacionesArgs<ExtArgs>
    _count?: boolean | VacanteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VacanteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
  }
  export type VacanteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
  }

  export type $VacantePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vacante"
    objects: {
      empresa: Prisma.$EmpresaPayload<ExtArgs>
      postulaciones: Prisma.$PostulacionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      titulo: string
      descripcion: string
      ubicacion: string
      tipo: string
      modalidad: string
      salario: string | null
      fechaCreacion: Date
      empresaId: number
    }, ExtArgs["result"]["vacante"]>
    composites: {}
  }

  type VacanteGetPayload<S extends boolean | null | undefined | VacanteDefaultArgs> = $Result.GetResult<Prisma.$VacantePayload, S>

  type VacanteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VacanteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VacanteCountAggregateInputType | true
    }

  export interface VacanteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vacante'], meta: { name: 'Vacante' } }
    /**
     * Find zero or one Vacante that matches the filter.
     * @param {VacanteFindUniqueArgs} args - Arguments to find a Vacante
     * @example
     * // Get one Vacante
     * const vacante = await prisma.vacante.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VacanteFindUniqueArgs>(args: SelectSubset<T, VacanteFindUniqueArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vacante that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VacanteFindUniqueOrThrowArgs} args - Arguments to find a Vacante
     * @example
     * // Get one Vacante
     * const vacante = await prisma.vacante.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VacanteFindUniqueOrThrowArgs>(args: SelectSubset<T, VacanteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vacante that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VacanteFindFirstArgs} args - Arguments to find a Vacante
     * @example
     * // Get one Vacante
     * const vacante = await prisma.vacante.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VacanteFindFirstArgs>(args?: SelectSubset<T, VacanteFindFirstArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vacante that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VacanteFindFirstOrThrowArgs} args - Arguments to find a Vacante
     * @example
     * // Get one Vacante
     * const vacante = await prisma.vacante.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VacanteFindFirstOrThrowArgs>(args?: SelectSubset<T, VacanteFindFirstOrThrowArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vacantes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VacanteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vacantes
     * const vacantes = await prisma.vacante.findMany()
     * 
     * // Get first 10 Vacantes
     * const vacantes = await prisma.vacante.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vacanteWithIdOnly = await prisma.vacante.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VacanteFindManyArgs>(args?: SelectSubset<T, VacanteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vacante.
     * @param {VacanteCreateArgs} args - Arguments to create a Vacante.
     * @example
     * // Create one Vacante
     * const Vacante = await prisma.vacante.create({
     *   data: {
     *     // ... data to create a Vacante
     *   }
     * })
     * 
     */
    create<T extends VacanteCreateArgs>(args: SelectSubset<T, VacanteCreateArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vacantes.
     * @param {VacanteCreateManyArgs} args - Arguments to create many Vacantes.
     * @example
     * // Create many Vacantes
     * const vacante = await prisma.vacante.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VacanteCreateManyArgs>(args?: SelectSubset<T, VacanteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vacantes and returns the data saved in the database.
     * @param {VacanteCreateManyAndReturnArgs} args - Arguments to create many Vacantes.
     * @example
     * // Create many Vacantes
     * const vacante = await prisma.vacante.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vacantes and only return the `id`
     * const vacanteWithIdOnly = await prisma.vacante.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VacanteCreateManyAndReturnArgs>(args?: SelectSubset<T, VacanteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vacante.
     * @param {VacanteDeleteArgs} args - Arguments to delete one Vacante.
     * @example
     * // Delete one Vacante
     * const Vacante = await prisma.vacante.delete({
     *   where: {
     *     // ... filter to delete one Vacante
     *   }
     * })
     * 
     */
    delete<T extends VacanteDeleteArgs>(args: SelectSubset<T, VacanteDeleteArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vacante.
     * @param {VacanteUpdateArgs} args - Arguments to update one Vacante.
     * @example
     * // Update one Vacante
     * const vacante = await prisma.vacante.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VacanteUpdateArgs>(args: SelectSubset<T, VacanteUpdateArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vacantes.
     * @param {VacanteDeleteManyArgs} args - Arguments to filter Vacantes to delete.
     * @example
     * // Delete a few Vacantes
     * const { count } = await prisma.vacante.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VacanteDeleteManyArgs>(args?: SelectSubset<T, VacanteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vacantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VacanteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vacantes
     * const vacante = await prisma.vacante.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VacanteUpdateManyArgs>(args: SelectSubset<T, VacanteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vacantes and returns the data updated in the database.
     * @param {VacanteUpdateManyAndReturnArgs} args - Arguments to update many Vacantes.
     * @example
     * // Update many Vacantes
     * const vacante = await prisma.vacante.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vacantes and only return the `id`
     * const vacanteWithIdOnly = await prisma.vacante.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VacanteUpdateManyAndReturnArgs>(args: SelectSubset<T, VacanteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vacante.
     * @param {VacanteUpsertArgs} args - Arguments to update or create a Vacante.
     * @example
     * // Update or create a Vacante
     * const vacante = await prisma.vacante.upsert({
     *   create: {
     *     // ... data to create a Vacante
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vacante we want to update
     *   }
     * })
     */
    upsert<T extends VacanteUpsertArgs>(args: SelectSubset<T, VacanteUpsertArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vacantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VacanteCountArgs} args - Arguments to filter Vacantes to count.
     * @example
     * // Count the number of Vacantes
     * const count = await prisma.vacante.count({
     *   where: {
     *     // ... the filter for the Vacantes we want to count
     *   }
     * })
    **/
    count<T extends VacanteCountArgs>(
      args?: Subset<T, VacanteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VacanteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vacante.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VacanteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VacanteAggregateArgs>(args: Subset<T, VacanteAggregateArgs>): Prisma.PrismaPromise<GetVacanteAggregateType<T>>

    /**
     * Group by Vacante.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VacanteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VacanteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VacanteGroupByArgs['orderBy'] }
        : { orderBy?: VacanteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VacanteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVacanteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vacante model
   */
  readonly fields: VacanteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vacante.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VacanteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    empresa<T extends EmpresaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmpresaDefaultArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    postulaciones<T extends Vacante$postulacionesArgs<ExtArgs> = {}>(args?: Subset<T, Vacante$postulacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vacante model
   */
  interface VacanteFieldRefs {
    readonly id: FieldRef<"Vacante", 'Int'>
    readonly titulo: FieldRef<"Vacante", 'String'>
    readonly descripcion: FieldRef<"Vacante", 'String'>
    readonly ubicacion: FieldRef<"Vacante", 'String'>
    readonly tipo: FieldRef<"Vacante", 'String'>
    readonly modalidad: FieldRef<"Vacante", 'String'>
    readonly salario: FieldRef<"Vacante", 'String'>
    readonly fechaCreacion: FieldRef<"Vacante", 'DateTime'>
    readonly empresaId: FieldRef<"Vacante", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Vacante findUnique
   */
  export type VacanteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * Filter, which Vacante to fetch.
     */
    where: VacanteWhereUniqueInput
  }

  /**
   * Vacante findUniqueOrThrow
   */
  export type VacanteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * Filter, which Vacante to fetch.
     */
    where: VacanteWhereUniqueInput
  }

  /**
   * Vacante findFirst
   */
  export type VacanteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * Filter, which Vacante to fetch.
     */
    where?: VacanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vacantes to fetch.
     */
    orderBy?: VacanteOrderByWithRelationInput | VacanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vacantes.
     */
    cursor?: VacanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vacantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vacantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vacantes.
     */
    distinct?: VacanteScalarFieldEnum | VacanteScalarFieldEnum[]
  }

  /**
   * Vacante findFirstOrThrow
   */
  export type VacanteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * Filter, which Vacante to fetch.
     */
    where?: VacanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vacantes to fetch.
     */
    orderBy?: VacanteOrderByWithRelationInput | VacanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vacantes.
     */
    cursor?: VacanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vacantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vacantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vacantes.
     */
    distinct?: VacanteScalarFieldEnum | VacanteScalarFieldEnum[]
  }

  /**
   * Vacante findMany
   */
  export type VacanteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * Filter, which Vacantes to fetch.
     */
    where?: VacanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vacantes to fetch.
     */
    orderBy?: VacanteOrderByWithRelationInput | VacanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vacantes.
     */
    cursor?: VacanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vacantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vacantes.
     */
    skip?: number
    distinct?: VacanteScalarFieldEnum | VacanteScalarFieldEnum[]
  }

  /**
   * Vacante create
   */
  export type VacanteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * The data needed to create a Vacante.
     */
    data: XOR<VacanteCreateInput, VacanteUncheckedCreateInput>
  }

  /**
   * Vacante createMany
   */
  export type VacanteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vacantes.
     */
    data: VacanteCreateManyInput | VacanteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vacante createManyAndReturn
   */
  export type VacanteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * The data used to create many Vacantes.
     */
    data: VacanteCreateManyInput | VacanteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vacante update
   */
  export type VacanteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * The data needed to update a Vacante.
     */
    data: XOR<VacanteUpdateInput, VacanteUncheckedUpdateInput>
    /**
     * Choose, which Vacante to update.
     */
    where: VacanteWhereUniqueInput
  }

  /**
   * Vacante updateMany
   */
  export type VacanteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vacantes.
     */
    data: XOR<VacanteUpdateManyMutationInput, VacanteUncheckedUpdateManyInput>
    /**
     * Filter which Vacantes to update
     */
    where?: VacanteWhereInput
    /**
     * Limit how many Vacantes to update.
     */
    limit?: number
  }

  /**
   * Vacante updateManyAndReturn
   */
  export type VacanteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * The data used to update Vacantes.
     */
    data: XOR<VacanteUpdateManyMutationInput, VacanteUncheckedUpdateManyInput>
    /**
     * Filter which Vacantes to update
     */
    where?: VacanteWhereInput
    /**
     * Limit how many Vacantes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vacante upsert
   */
  export type VacanteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * The filter to search for the Vacante to update in case it exists.
     */
    where: VacanteWhereUniqueInput
    /**
     * In case the Vacante found by the `where` argument doesn't exist, create a new Vacante with this data.
     */
    create: XOR<VacanteCreateInput, VacanteUncheckedCreateInput>
    /**
     * In case the Vacante was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VacanteUpdateInput, VacanteUncheckedUpdateInput>
  }

  /**
   * Vacante delete
   */
  export type VacanteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
    /**
     * Filter which Vacante to delete.
     */
    where: VacanteWhereUniqueInput
  }

  /**
   * Vacante deleteMany
   */
  export type VacanteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vacantes to delete
     */
    where?: VacanteWhereInput
    /**
     * Limit how many Vacantes to delete.
     */
    limit?: number
  }

  /**
   * Vacante.postulaciones
   */
  export type Vacante$postulacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    where?: PostulacionWhereInput
    orderBy?: PostulacionOrderByWithRelationInput | PostulacionOrderByWithRelationInput[]
    cursor?: PostulacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostulacionScalarFieldEnum | PostulacionScalarFieldEnum[]
  }

  /**
   * Vacante without action
   */
  export type VacanteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vacante
     */
    select?: VacanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vacante
     */
    omit?: VacanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VacanteInclude<ExtArgs> | null
  }


  /**
   * Model Postulacion
   */

  export type AggregatePostulacion = {
    _count: PostulacionCountAggregateOutputType | null
    _avg: PostulacionAvgAggregateOutputType | null
    _sum: PostulacionSumAggregateOutputType | null
    _min: PostulacionMinAggregateOutputType | null
    _max: PostulacionMaxAggregateOutputType | null
  }

  export type PostulacionAvgAggregateOutputType = {
    id: number | null
    vacanteId: number | null
    usuarioId: number | null
  }

  export type PostulacionSumAggregateOutputType = {
    id: number | null
    vacanteId: number | null
    usuarioId: number | null
  }

  export type PostulacionMinAggregateOutputType = {
    id: number | null
    telefono: string | null
    cv_url: string | null
    estado: string | null
    fecha: Date | null
    vacanteId: number | null
    usuarioId: number | null
  }

  export type PostulacionMaxAggregateOutputType = {
    id: number | null
    telefono: string | null
    cv_url: string | null
    estado: string | null
    fecha: Date | null
    vacanteId: number | null
    usuarioId: number | null
  }

  export type PostulacionCountAggregateOutputType = {
    id: number
    telefono: number
    cv_url: number
    estado: number
    fecha: number
    vacanteId: number
    usuarioId: number
    _all: number
  }


  export type PostulacionAvgAggregateInputType = {
    id?: true
    vacanteId?: true
    usuarioId?: true
  }

  export type PostulacionSumAggregateInputType = {
    id?: true
    vacanteId?: true
    usuarioId?: true
  }

  export type PostulacionMinAggregateInputType = {
    id?: true
    telefono?: true
    cv_url?: true
    estado?: true
    fecha?: true
    vacanteId?: true
    usuarioId?: true
  }

  export type PostulacionMaxAggregateInputType = {
    id?: true
    telefono?: true
    cv_url?: true
    estado?: true
    fecha?: true
    vacanteId?: true
    usuarioId?: true
  }

  export type PostulacionCountAggregateInputType = {
    id?: true
    telefono?: true
    cv_url?: true
    estado?: true
    fecha?: true
    vacanteId?: true
    usuarioId?: true
    _all?: true
  }

  export type PostulacionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Postulacion to aggregate.
     */
    where?: PostulacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postulacions to fetch.
     */
    orderBy?: PostulacionOrderByWithRelationInput | PostulacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostulacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postulacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postulacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Postulacions
    **/
    _count?: true | PostulacionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostulacionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostulacionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostulacionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostulacionMaxAggregateInputType
  }

  export type GetPostulacionAggregateType<T extends PostulacionAggregateArgs> = {
        [P in keyof T & keyof AggregatePostulacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePostulacion[P]>
      : GetScalarType<T[P], AggregatePostulacion[P]>
  }




  export type PostulacionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostulacionWhereInput
    orderBy?: PostulacionOrderByWithAggregationInput | PostulacionOrderByWithAggregationInput[]
    by: PostulacionScalarFieldEnum[] | PostulacionScalarFieldEnum
    having?: PostulacionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostulacionCountAggregateInputType | true
    _avg?: PostulacionAvgAggregateInputType
    _sum?: PostulacionSumAggregateInputType
    _min?: PostulacionMinAggregateInputType
    _max?: PostulacionMaxAggregateInputType
  }

  export type PostulacionGroupByOutputType = {
    id: number
    telefono: string | null
    cv_url: string | null
    estado: string
    fecha: Date
    vacanteId: number
    usuarioId: number
    _count: PostulacionCountAggregateOutputType | null
    _avg: PostulacionAvgAggregateOutputType | null
    _sum: PostulacionSumAggregateOutputType | null
    _min: PostulacionMinAggregateOutputType | null
    _max: PostulacionMaxAggregateOutputType | null
  }

  type GetPostulacionGroupByPayload<T extends PostulacionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostulacionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostulacionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostulacionGroupByOutputType[P]>
            : GetScalarType<T[P], PostulacionGroupByOutputType[P]>
        }
      >
    >


  export type PostulacionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telefono?: boolean
    cv_url?: boolean
    estado?: boolean
    fecha?: boolean
    vacanteId?: boolean
    usuarioId?: boolean
    vacante?: boolean | VacanteDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postulacion"]>

  export type PostulacionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telefono?: boolean
    cv_url?: boolean
    estado?: boolean
    fecha?: boolean
    vacanteId?: boolean
    usuarioId?: boolean
    vacante?: boolean | VacanteDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postulacion"]>

  export type PostulacionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telefono?: boolean
    cv_url?: boolean
    estado?: boolean
    fecha?: boolean
    vacanteId?: boolean
    usuarioId?: boolean
    vacante?: boolean | VacanteDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postulacion"]>

  export type PostulacionSelectScalar = {
    id?: boolean
    telefono?: boolean
    cv_url?: boolean
    estado?: boolean
    fecha?: boolean
    vacanteId?: boolean
    usuarioId?: boolean
  }

  export type PostulacionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "telefono" | "cv_url" | "estado" | "fecha" | "vacanteId" | "usuarioId", ExtArgs["result"]["postulacion"]>
  export type PostulacionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vacante?: boolean | VacanteDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type PostulacionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vacante?: boolean | VacanteDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type PostulacionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vacante?: boolean | VacanteDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $PostulacionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Postulacion"
    objects: {
      vacante: Prisma.$VacantePayload<ExtArgs>
      usuario: Prisma.$UsuarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      telefono: string | null
      cv_url: string | null
      estado: string
      fecha: Date
      vacanteId: number
      usuarioId: number
    }, ExtArgs["result"]["postulacion"]>
    composites: {}
  }

  type PostulacionGetPayload<S extends boolean | null | undefined | PostulacionDefaultArgs> = $Result.GetResult<Prisma.$PostulacionPayload, S>

  type PostulacionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostulacionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostulacionCountAggregateInputType | true
    }

  export interface PostulacionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Postulacion'], meta: { name: 'Postulacion' } }
    /**
     * Find zero or one Postulacion that matches the filter.
     * @param {PostulacionFindUniqueArgs} args - Arguments to find a Postulacion
     * @example
     * // Get one Postulacion
     * const postulacion = await prisma.postulacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostulacionFindUniqueArgs>(args: SelectSubset<T, PostulacionFindUniqueArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Postulacion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostulacionFindUniqueOrThrowArgs} args - Arguments to find a Postulacion
     * @example
     * // Get one Postulacion
     * const postulacion = await prisma.postulacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostulacionFindUniqueOrThrowArgs>(args: SelectSubset<T, PostulacionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Postulacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostulacionFindFirstArgs} args - Arguments to find a Postulacion
     * @example
     * // Get one Postulacion
     * const postulacion = await prisma.postulacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostulacionFindFirstArgs>(args?: SelectSubset<T, PostulacionFindFirstArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Postulacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostulacionFindFirstOrThrowArgs} args - Arguments to find a Postulacion
     * @example
     * // Get one Postulacion
     * const postulacion = await prisma.postulacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostulacionFindFirstOrThrowArgs>(args?: SelectSubset<T, PostulacionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Postulacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostulacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Postulacions
     * const postulacions = await prisma.postulacion.findMany()
     * 
     * // Get first 10 Postulacions
     * const postulacions = await prisma.postulacion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postulacionWithIdOnly = await prisma.postulacion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostulacionFindManyArgs>(args?: SelectSubset<T, PostulacionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Postulacion.
     * @param {PostulacionCreateArgs} args - Arguments to create a Postulacion.
     * @example
     * // Create one Postulacion
     * const Postulacion = await prisma.postulacion.create({
     *   data: {
     *     // ... data to create a Postulacion
     *   }
     * })
     * 
     */
    create<T extends PostulacionCreateArgs>(args: SelectSubset<T, PostulacionCreateArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Postulacions.
     * @param {PostulacionCreateManyArgs} args - Arguments to create many Postulacions.
     * @example
     * // Create many Postulacions
     * const postulacion = await prisma.postulacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostulacionCreateManyArgs>(args?: SelectSubset<T, PostulacionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Postulacions and returns the data saved in the database.
     * @param {PostulacionCreateManyAndReturnArgs} args - Arguments to create many Postulacions.
     * @example
     * // Create many Postulacions
     * const postulacion = await prisma.postulacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Postulacions and only return the `id`
     * const postulacionWithIdOnly = await prisma.postulacion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostulacionCreateManyAndReturnArgs>(args?: SelectSubset<T, PostulacionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Postulacion.
     * @param {PostulacionDeleteArgs} args - Arguments to delete one Postulacion.
     * @example
     * // Delete one Postulacion
     * const Postulacion = await prisma.postulacion.delete({
     *   where: {
     *     // ... filter to delete one Postulacion
     *   }
     * })
     * 
     */
    delete<T extends PostulacionDeleteArgs>(args: SelectSubset<T, PostulacionDeleteArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Postulacion.
     * @param {PostulacionUpdateArgs} args - Arguments to update one Postulacion.
     * @example
     * // Update one Postulacion
     * const postulacion = await prisma.postulacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostulacionUpdateArgs>(args: SelectSubset<T, PostulacionUpdateArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Postulacions.
     * @param {PostulacionDeleteManyArgs} args - Arguments to filter Postulacions to delete.
     * @example
     * // Delete a few Postulacions
     * const { count } = await prisma.postulacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostulacionDeleteManyArgs>(args?: SelectSubset<T, PostulacionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Postulacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostulacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Postulacions
     * const postulacion = await prisma.postulacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostulacionUpdateManyArgs>(args: SelectSubset<T, PostulacionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Postulacions and returns the data updated in the database.
     * @param {PostulacionUpdateManyAndReturnArgs} args - Arguments to update many Postulacions.
     * @example
     * // Update many Postulacions
     * const postulacion = await prisma.postulacion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Postulacions and only return the `id`
     * const postulacionWithIdOnly = await prisma.postulacion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostulacionUpdateManyAndReturnArgs>(args: SelectSubset<T, PostulacionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Postulacion.
     * @param {PostulacionUpsertArgs} args - Arguments to update or create a Postulacion.
     * @example
     * // Update or create a Postulacion
     * const postulacion = await prisma.postulacion.upsert({
     *   create: {
     *     // ... data to create a Postulacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Postulacion we want to update
     *   }
     * })
     */
    upsert<T extends PostulacionUpsertArgs>(args: SelectSubset<T, PostulacionUpsertArgs<ExtArgs>>): Prisma__PostulacionClient<$Result.GetResult<Prisma.$PostulacionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Postulacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostulacionCountArgs} args - Arguments to filter Postulacions to count.
     * @example
     * // Count the number of Postulacions
     * const count = await prisma.postulacion.count({
     *   where: {
     *     // ... the filter for the Postulacions we want to count
     *   }
     * })
    **/
    count<T extends PostulacionCountArgs>(
      args?: Subset<T, PostulacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostulacionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Postulacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostulacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostulacionAggregateArgs>(args: Subset<T, PostulacionAggregateArgs>): Prisma.PrismaPromise<GetPostulacionAggregateType<T>>

    /**
     * Group by Postulacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostulacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostulacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostulacionGroupByArgs['orderBy'] }
        : { orderBy?: PostulacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostulacionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostulacionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Postulacion model
   */
  readonly fields: PostulacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Postulacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostulacionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vacante<T extends VacanteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VacanteDefaultArgs<ExtArgs>>): Prisma__VacanteClient<$Result.GetResult<Prisma.$VacantePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Postulacion model
   */
  interface PostulacionFieldRefs {
    readonly id: FieldRef<"Postulacion", 'Int'>
    readonly telefono: FieldRef<"Postulacion", 'String'>
    readonly cv_url: FieldRef<"Postulacion", 'String'>
    readonly estado: FieldRef<"Postulacion", 'String'>
    readonly fecha: FieldRef<"Postulacion", 'DateTime'>
    readonly vacanteId: FieldRef<"Postulacion", 'Int'>
    readonly usuarioId: FieldRef<"Postulacion", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Postulacion findUnique
   */
  export type PostulacionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * Filter, which Postulacion to fetch.
     */
    where: PostulacionWhereUniqueInput
  }

  /**
   * Postulacion findUniqueOrThrow
   */
  export type PostulacionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * Filter, which Postulacion to fetch.
     */
    where: PostulacionWhereUniqueInput
  }

  /**
   * Postulacion findFirst
   */
  export type PostulacionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * Filter, which Postulacion to fetch.
     */
    where?: PostulacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postulacions to fetch.
     */
    orderBy?: PostulacionOrderByWithRelationInput | PostulacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Postulacions.
     */
    cursor?: PostulacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postulacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postulacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Postulacions.
     */
    distinct?: PostulacionScalarFieldEnum | PostulacionScalarFieldEnum[]
  }

  /**
   * Postulacion findFirstOrThrow
   */
  export type PostulacionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * Filter, which Postulacion to fetch.
     */
    where?: PostulacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postulacions to fetch.
     */
    orderBy?: PostulacionOrderByWithRelationInput | PostulacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Postulacions.
     */
    cursor?: PostulacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postulacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postulacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Postulacions.
     */
    distinct?: PostulacionScalarFieldEnum | PostulacionScalarFieldEnum[]
  }

  /**
   * Postulacion findMany
   */
  export type PostulacionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * Filter, which Postulacions to fetch.
     */
    where?: PostulacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postulacions to fetch.
     */
    orderBy?: PostulacionOrderByWithRelationInput | PostulacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Postulacions.
     */
    cursor?: PostulacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postulacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postulacions.
     */
    skip?: number
    distinct?: PostulacionScalarFieldEnum | PostulacionScalarFieldEnum[]
  }

  /**
   * Postulacion create
   */
  export type PostulacionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * The data needed to create a Postulacion.
     */
    data: XOR<PostulacionCreateInput, PostulacionUncheckedCreateInput>
  }

  /**
   * Postulacion createMany
   */
  export type PostulacionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Postulacions.
     */
    data: PostulacionCreateManyInput | PostulacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Postulacion createManyAndReturn
   */
  export type PostulacionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * The data used to create many Postulacions.
     */
    data: PostulacionCreateManyInput | PostulacionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Postulacion update
   */
  export type PostulacionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * The data needed to update a Postulacion.
     */
    data: XOR<PostulacionUpdateInput, PostulacionUncheckedUpdateInput>
    /**
     * Choose, which Postulacion to update.
     */
    where: PostulacionWhereUniqueInput
  }

  /**
   * Postulacion updateMany
   */
  export type PostulacionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Postulacions.
     */
    data: XOR<PostulacionUpdateManyMutationInput, PostulacionUncheckedUpdateManyInput>
    /**
     * Filter which Postulacions to update
     */
    where?: PostulacionWhereInput
    /**
     * Limit how many Postulacions to update.
     */
    limit?: number
  }

  /**
   * Postulacion updateManyAndReturn
   */
  export type PostulacionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * The data used to update Postulacions.
     */
    data: XOR<PostulacionUpdateManyMutationInput, PostulacionUncheckedUpdateManyInput>
    /**
     * Filter which Postulacions to update
     */
    where?: PostulacionWhereInput
    /**
     * Limit how many Postulacions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Postulacion upsert
   */
  export type PostulacionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * The filter to search for the Postulacion to update in case it exists.
     */
    where: PostulacionWhereUniqueInput
    /**
     * In case the Postulacion found by the `where` argument doesn't exist, create a new Postulacion with this data.
     */
    create: XOR<PostulacionCreateInput, PostulacionUncheckedCreateInput>
    /**
     * In case the Postulacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostulacionUpdateInput, PostulacionUncheckedUpdateInput>
  }

  /**
   * Postulacion delete
   */
  export type PostulacionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
    /**
     * Filter which Postulacion to delete.
     */
    where: PostulacionWhereUniqueInput
  }

  /**
   * Postulacion deleteMany
   */
  export type PostulacionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Postulacions to delete
     */
    where?: PostulacionWhereInput
    /**
     * Limit how many Postulacions to delete.
     */
    limit?: number
  }

  /**
   * Postulacion without action
   */
  export type PostulacionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Postulacion
     */
    select?: PostulacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Postulacion
     */
    omit?: PostulacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostulacionInclude<ExtArgs> | null
  }


  /**
   * Model Mensaje
   */

  export type AggregateMensaje = {
    _count: MensajeCountAggregateOutputType | null
    _avg: MensajeAvgAggregateOutputType | null
    _sum: MensajeSumAggregateOutputType | null
    _min: MensajeMinAggregateOutputType | null
    _max: MensajeMaxAggregateOutputType | null
  }

  export type MensajeAvgAggregateOutputType = {
    id: number | null
    senderEmpresaId: number | null
    senderUsuarioId: number | null
    receiverId: number | null
  }

  export type MensajeSumAggregateOutputType = {
    id: number | null
    senderEmpresaId: number | null
    senderUsuarioId: number | null
    receiverId: number | null
  }

  export type MensajeMinAggregateOutputType = {
    id: number | null
    contenido: string | null
    fechaEnvio: Date | null
    read: boolean | null
    senderType: string | null
    senderEmpresaId: number | null
    senderUsuarioId: number | null
    receiverId: number | null
  }

  export type MensajeMaxAggregateOutputType = {
    id: number | null
    contenido: string | null
    fechaEnvio: Date | null
    read: boolean | null
    senderType: string | null
    senderEmpresaId: number | null
    senderUsuarioId: number | null
    receiverId: number | null
  }

  export type MensajeCountAggregateOutputType = {
    id: number
    contenido: number
    fechaEnvio: number
    read: number
    senderType: number
    senderEmpresaId: number
    senderUsuarioId: number
    receiverId: number
    _all: number
  }


  export type MensajeAvgAggregateInputType = {
    id?: true
    senderEmpresaId?: true
    senderUsuarioId?: true
    receiverId?: true
  }

  export type MensajeSumAggregateInputType = {
    id?: true
    senderEmpresaId?: true
    senderUsuarioId?: true
    receiverId?: true
  }

  export type MensajeMinAggregateInputType = {
    id?: true
    contenido?: true
    fechaEnvio?: true
    read?: true
    senderType?: true
    senderEmpresaId?: true
    senderUsuarioId?: true
    receiverId?: true
  }

  export type MensajeMaxAggregateInputType = {
    id?: true
    contenido?: true
    fechaEnvio?: true
    read?: true
    senderType?: true
    senderEmpresaId?: true
    senderUsuarioId?: true
    receiverId?: true
  }

  export type MensajeCountAggregateInputType = {
    id?: true
    contenido?: true
    fechaEnvio?: true
    read?: true
    senderType?: true
    senderEmpresaId?: true
    senderUsuarioId?: true
    receiverId?: true
    _all?: true
  }

  export type MensajeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mensaje to aggregate.
     */
    where?: MensajeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mensajes to fetch.
     */
    orderBy?: MensajeOrderByWithRelationInput | MensajeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MensajeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mensajes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mensajes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Mensajes
    **/
    _count?: true | MensajeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MensajeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MensajeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MensajeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MensajeMaxAggregateInputType
  }

  export type GetMensajeAggregateType<T extends MensajeAggregateArgs> = {
        [P in keyof T & keyof AggregateMensaje]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMensaje[P]>
      : GetScalarType<T[P], AggregateMensaje[P]>
  }




  export type MensajeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MensajeWhereInput
    orderBy?: MensajeOrderByWithAggregationInput | MensajeOrderByWithAggregationInput[]
    by: MensajeScalarFieldEnum[] | MensajeScalarFieldEnum
    having?: MensajeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MensajeCountAggregateInputType | true
    _avg?: MensajeAvgAggregateInputType
    _sum?: MensajeSumAggregateInputType
    _min?: MensajeMinAggregateInputType
    _max?: MensajeMaxAggregateInputType
  }

  export type MensajeGroupByOutputType = {
    id: number
    contenido: string
    fechaEnvio: Date
    read: boolean
    senderType: string
    senderEmpresaId: number | null
    senderUsuarioId: number | null
    receiverId: number
    _count: MensajeCountAggregateOutputType | null
    _avg: MensajeAvgAggregateOutputType | null
    _sum: MensajeSumAggregateOutputType | null
    _min: MensajeMinAggregateOutputType | null
    _max: MensajeMaxAggregateOutputType | null
  }

  type GetMensajeGroupByPayload<T extends MensajeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MensajeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MensajeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MensajeGroupByOutputType[P]>
            : GetScalarType<T[P], MensajeGroupByOutputType[P]>
        }
      >
    >


  export type MensajeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contenido?: boolean
    fechaEnvio?: boolean
    read?: boolean
    senderType?: boolean
    senderEmpresaId?: boolean
    senderUsuarioId?: boolean
    receiverId?: boolean
    senderEmpresa?: boolean | Mensaje$senderEmpresaArgs<ExtArgs>
    senderUsuario?: boolean | Mensaje$senderUsuarioArgs<ExtArgs>
    receiver?: boolean | UsuarioDefaultArgs<ExtArgs>
    notificacion?: boolean | Mensaje$notificacionArgs<ExtArgs>
  }, ExtArgs["result"]["mensaje"]>

  export type MensajeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contenido?: boolean
    fechaEnvio?: boolean
    read?: boolean
    senderType?: boolean
    senderEmpresaId?: boolean
    senderUsuarioId?: boolean
    receiverId?: boolean
    senderEmpresa?: boolean | Mensaje$senderEmpresaArgs<ExtArgs>
    senderUsuario?: boolean | Mensaje$senderUsuarioArgs<ExtArgs>
    receiver?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mensaje"]>

  export type MensajeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contenido?: boolean
    fechaEnvio?: boolean
    read?: boolean
    senderType?: boolean
    senderEmpresaId?: boolean
    senderUsuarioId?: boolean
    receiverId?: boolean
    senderEmpresa?: boolean | Mensaje$senderEmpresaArgs<ExtArgs>
    senderUsuario?: boolean | Mensaje$senderUsuarioArgs<ExtArgs>
    receiver?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mensaje"]>

  export type MensajeSelectScalar = {
    id?: boolean
    contenido?: boolean
    fechaEnvio?: boolean
    read?: boolean
    senderType?: boolean
    senderEmpresaId?: boolean
    senderUsuarioId?: boolean
    receiverId?: boolean
  }

  export type MensajeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contenido" | "fechaEnvio" | "read" | "senderType" | "senderEmpresaId" | "senderUsuarioId" | "receiverId", ExtArgs["result"]["mensaje"]>
  export type MensajeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    senderEmpresa?: boolean | Mensaje$senderEmpresaArgs<ExtArgs>
    senderUsuario?: boolean | Mensaje$senderUsuarioArgs<ExtArgs>
    receiver?: boolean | UsuarioDefaultArgs<ExtArgs>
    notificacion?: boolean | Mensaje$notificacionArgs<ExtArgs>
  }
  export type MensajeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    senderEmpresa?: boolean | Mensaje$senderEmpresaArgs<ExtArgs>
    senderUsuario?: boolean | Mensaje$senderUsuarioArgs<ExtArgs>
    receiver?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type MensajeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    senderEmpresa?: boolean | Mensaje$senderEmpresaArgs<ExtArgs>
    senderUsuario?: boolean | Mensaje$senderUsuarioArgs<ExtArgs>
    receiver?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $MensajePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Mensaje"
    objects: {
      senderEmpresa: Prisma.$EmpresaPayload<ExtArgs> | null
      senderUsuario: Prisma.$UsuarioPayload<ExtArgs> | null
      receiver: Prisma.$UsuarioPayload<ExtArgs>
      notificacion: Prisma.$NotificacionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      contenido: string
      fechaEnvio: Date
      read: boolean
      senderType: string
      senderEmpresaId: number | null
      senderUsuarioId: number | null
      receiverId: number
    }, ExtArgs["result"]["mensaje"]>
    composites: {}
  }

  type MensajeGetPayload<S extends boolean | null | undefined | MensajeDefaultArgs> = $Result.GetResult<Prisma.$MensajePayload, S>

  type MensajeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MensajeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MensajeCountAggregateInputType | true
    }

  export interface MensajeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Mensaje'], meta: { name: 'Mensaje' } }
    /**
     * Find zero or one Mensaje that matches the filter.
     * @param {MensajeFindUniqueArgs} args - Arguments to find a Mensaje
     * @example
     * // Get one Mensaje
     * const mensaje = await prisma.mensaje.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MensajeFindUniqueArgs>(args: SelectSubset<T, MensajeFindUniqueArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mensaje that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MensajeFindUniqueOrThrowArgs} args - Arguments to find a Mensaje
     * @example
     * // Get one Mensaje
     * const mensaje = await prisma.mensaje.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MensajeFindUniqueOrThrowArgs>(args: SelectSubset<T, MensajeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mensaje that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensajeFindFirstArgs} args - Arguments to find a Mensaje
     * @example
     * // Get one Mensaje
     * const mensaje = await prisma.mensaje.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MensajeFindFirstArgs>(args?: SelectSubset<T, MensajeFindFirstArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mensaje that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensajeFindFirstOrThrowArgs} args - Arguments to find a Mensaje
     * @example
     * // Get one Mensaje
     * const mensaje = await prisma.mensaje.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MensajeFindFirstOrThrowArgs>(args?: SelectSubset<T, MensajeFindFirstOrThrowArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mensajes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensajeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mensajes
     * const mensajes = await prisma.mensaje.findMany()
     * 
     * // Get first 10 Mensajes
     * const mensajes = await prisma.mensaje.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mensajeWithIdOnly = await prisma.mensaje.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MensajeFindManyArgs>(args?: SelectSubset<T, MensajeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mensaje.
     * @param {MensajeCreateArgs} args - Arguments to create a Mensaje.
     * @example
     * // Create one Mensaje
     * const Mensaje = await prisma.mensaje.create({
     *   data: {
     *     // ... data to create a Mensaje
     *   }
     * })
     * 
     */
    create<T extends MensajeCreateArgs>(args: SelectSubset<T, MensajeCreateArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mensajes.
     * @param {MensajeCreateManyArgs} args - Arguments to create many Mensajes.
     * @example
     * // Create many Mensajes
     * const mensaje = await prisma.mensaje.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MensajeCreateManyArgs>(args?: SelectSubset<T, MensajeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Mensajes and returns the data saved in the database.
     * @param {MensajeCreateManyAndReturnArgs} args - Arguments to create many Mensajes.
     * @example
     * // Create many Mensajes
     * const mensaje = await prisma.mensaje.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Mensajes and only return the `id`
     * const mensajeWithIdOnly = await prisma.mensaje.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MensajeCreateManyAndReturnArgs>(args?: SelectSubset<T, MensajeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Mensaje.
     * @param {MensajeDeleteArgs} args - Arguments to delete one Mensaje.
     * @example
     * // Delete one Mensaje
     * const Mensaje = await prisma.mensaje.delete({
     *   where: {
     *     // ... filter to delete one Mensaje
     *   }
     * })
     * 
     */
    delete<T extends MensajeDeleteArgs>(args: SelectSubset<T, MensajeDeleteArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mensaje.
     * @param {MensajeUpdateArgs} args - Arguments to update one Mensaje.
     * @example
     * // Update one Mensaje
     * const mensaje = await prisma.mensaje.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MensajeUpdateArgs>(args: SelectSubset<T, MensajeUpdateArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mensajes.
     * @param {MensajeDeleteManyArgs} args - Arguments to filter Mensajes to delete.
     * @example
     * // Delete a few Mensajes
     * const { count } = await prisma.mensaje.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MensajeDeleteManyArgs>(args?: SelectSubset<T, MensajeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mensajes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensajeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mensajes
     * const mensaje = await prisma.mensaje.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MensajeUpdateManyArgs>(args: SelectSubset<T, MensajeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mensajes and returns the data updated in the database.
     * @param {MensajeUpdateManyAndReturnArgs} args - Arguments to update many Mensajes.
     * @example
     * // Update many Mensajes
     * const mensaje = await prisma.mensaje.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Mensajes and only return the `id`
     * const mensajeWithIdOnly = await prisma.mensaje.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MensajeUpdateManyAndReturnArgs>(args: SelectSubset<T, MensajeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Mensaje.
     * @param {MensajeUpsertArgs} args - Arguments to update or create a Mensaje.
     * @example
     * // Update or create a Mensaje
     * const mensaje = await prisma.mensaje.upsert({
     *   create: {
     *     // ... data to create a Mensaje
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mensaje we want to update
     *   }
     * })
     */
    upsert<T extends MensajeUpsertArgs>(args: SelectSubset<T, MensajeUpsertArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mensajes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensajeCountArgs} args - Arguments to filter Mensajes to count.
     * @example
     * // Count the number of Mensajes
     * const count = await prisma.mensaje.count({
     *   where: {
     *     // ... the filter for the Mensajes we want to count
     *   }
     * })
    **/
    count<T extends MensajeCountArgs>(
      args?: Subset<T, MensajeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MensajeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mensaje.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensajeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MensajeAggregateArgs>(args: Subset<T, MensajeAggregateArgs>): Prisma.PrismaPromise<GetMensajeAggregateType<T>>

    /**
     * Group by Mensaje.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensajeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MensajeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MensajeGroupByArgs['orderBy'] }
        : { orderBy?: MensajeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MensajeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMensajeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Mensaje model
   */
  readonly fields: MensajeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Mensaje.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MensajeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    senderEmpresa<T extends Mensaje$senderEmpresaArgs<ExtArgs> = {}>(args?: Subset<T, Mensaje$senderEmpresaArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    senderUsuario<T extends Mensaje$senderUsuarioArgs<ExtArgs> = {}>(args?: Subset<T, Mensaje$senderUsuarioArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    notificacion<T extends Mensaje$notificacionArgs<ExtArgs> = {}>(args?: Subset<T, Mensaje$notificacionArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Mensaje model
   */
  interface MensajeFieldRefs {
    readonly id: FieldRef<"Mensaje", 'Int'>
    readonly contenido: FieldRef<"Mensaje", 'String'>
    readonly fechaEnvio: FieldRef<"Mensaje", 'DateTime'>
    readonly read: FieldRef<"Mensaje", 'Boolean'>
    readonly senderType: FieldRef<"Mensaje", 'String'>
    readonly senderEmpresaId: FieldRef<"Mensaje", 'Int'>
    readonly senderUsuarioId: FieldRef<"Mensaje", 'Int'>
    readonly receiverId: FieldRef<"Mensaje", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Mensaje findUnique
   */
  export type MensajeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * Filter, which Mensaje to fetch.
     */
    where: MensajeWhereUniqueInput
  }

  /**
   * Mensaje findUniqueOrThrow
   */
  export type MensajeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * Filter, which Mensaje to fetch.
     */
    where: MensajeWhereUniqueInput
  }

  /**
   * Mensaje findFirst
   */
  export type MensajeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * Filter, which Mensaje to fetch.
     */
    where?: MensajeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mensajes to fetch.
     */
    orderBy?: MensajeOrderByWithRelationInput | MensajeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mensajes.
     */
    cursor?: MensajeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mensajes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mensajes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mensajes.
     */
    distinct?: MensajeScalarFieldEnum | MensajeScalarFieldEnum[]
  }

  /**
   * Mensaje findFirstOrThrow
   */
  export type MensajeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * Filter, which Mensaje to fetch.
     */
    where?: MensajeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mensajes to fetch.
     */
    orderBy?: MensajeOrderByWithRelationInput | MensajeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mensajes.
     */
    cursor?: MensajeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mensajes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mensajes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mensajes.
     */
    distinct?: MensajeScalarFieldEnum | MensajeScalarFieldEnum[]
  }

  /**
   * Mensaje findMany
   */
  export type MensajeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * Filter, which Mensajes to fetch.
     */
    where?: MensajeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mensajes to fetch.
     */
    orderBy?: MensajeOrderByWithRelationInput | MensajeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Mensajes.
     */
    cursor?: MensajeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mensajes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mensajes.
     */
    skip?: number
    distinct?: MensajeScalarFieldEnum | MensajeScalarFieldEnum[]
  }

  /**
   * Mensaje create
   */
  export type MensajeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * The data needed to create a Mensaje.
     */
    data: XOR<MensajeCreateInput, MensajeUncheckedCreateInput>
  }

  /**
   * Mensaje createMany
   */
  export type MensajeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Mensajes.
     */
    data: MensajeCreateManyInput | MensajeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mensaje createManyAndReturn
   */
  export type MensajeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * The data used to create many Mensajes.
     */
    data: MensajeCreateManyInput | MensajeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mensaje update
   */
  export type MensajeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * The data needed to update a Mensaje.
     */
    data: XOR<MensajeUpdateInput, MensajeUncheckedUpdateInput>
    /**
     * Choose, which Mensaje to update.
     */
    where: MensajeWhereUniqueInput
  }

  /**
   * Mensaje updateMany
   */
  export type MensajeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Mensajes.
     */
    data: XOR<MensajeUpdateManyMutationInput, MensajeUncheckedUpdateManyInput>
    /**
     * Filter which Mensajes to update
     */
    where?: MensajeWhereInput
    /**
     * Limit how many Mensajes to update.
     */
    limit?: number
  }

  /**
   * Mensaje updateManyAndReturn
   */
  export type MensajeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * The data used to update Mensajes.
     */
    data: XOR<MensajeUpdateManyMutationInput, MensajeUncheckedUpdateManyInput>
    /**
     * Filter which Mensajes to update
     */
    where?: MensajeWhereInput
    /**
     * Limit how many Mensajes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mensaje upsert
   */
  export type MensajeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * The filter to search for the Mensaje to update in case it exists.
     */
    where: MensajeWhereUniqueInput
    /**
     * In case the Mensaje found by the `where` argument doesn't exist, create a new Mensaje with this data.
     */
    create: XOR<MensajeCreateInput, MensajeUncheckedCreateInput>
    /**
     * In case the Mensaje was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MensajeUpdateInput, MensajeUncheckedUpdateInput>
  }

  /**
   * Mensaje delete
   */
  export type MensajeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    /**
     * Filter which Mensaje to delete.
     */
    where: MensajeWhereUniqueInput
  }

  /**
   * Mensaje deleteMany
   */
  export type MensajeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mensajes to delete
     */
    where?: MensajeWhereInput
    /**
     * Limit how many Mensajes to delete.
     */
    limit?: number
  }

  /**
   * Mensaje.senderEmpresa
   */
  export type Mensaje$senderEmpresaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    where?: EmpresaWhereInput
  }

  /**
   * Mensaje.senderUsuario
   */
  export type Mensaje$senderUsuarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    where?: UsuarioWhereInput
  }

  /**
   * Mensaje.notificacion
   */
  export type Mensaje$notificacionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    where?: NotificacionWhereInput
  }

  /**
   * Mensaje without action
   */
  export type MensajeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
  }


  /**
   * Model Notificacion
   */

  export type AggregateNotificacion = {
    _count: NotificacionCountAggregateOutputType | null
    _avg: NotificacionAvgAggregateOutputType | null
    _sum: NotificacionSumAggregateOutputType | null
    _min: NotificacionMinAggregateOutputType | null
    _max: NotificacionMaxAggregateOutputType | null
  }

  export type NotificacionAvgAggregateOutputType = {
    id: number | null
    referenciaId: number | null
    mensajeId: number | null
    usuarioId: number | null
  }

  export type NotificacionSumAggregateOutputType = {
    id: number | null
    referenciaId: number | null
    mensajeId: number | null
    usuarioId: number | null
  }

  export type NotificacionMinAggregateOutputType = {
    id: number | null
    tipo: string | null
    contenido: string | null
    fecha: Date | null
    vista: boolean | null
    referenciaId: number | null
    mensajeId: number | null
    usuarioId: number | null
  }

  export type NotificacionMaxAggregateOutputType = {
    id: number | null
    tipo: string | null
    contenido: string | null
    fecha: Date | null
    vista: boolean | null
    referenciaId: number | null
    mensajeId: number | null
    usuarioId: number | null
  }

  export type NotificacionCountAggregateOutputType = {
    id: number
    tipo: number
    contenido: number
    fecha: number
    vista: number
    referenciaId: number
    mensajeId: number
    usuarioId: number
    _all: number
  }


  export type NotificacionAvgAggregateInputType = {
    id?: true
    referenciaId?: true
    mensajeId?: true
    usuarioId?: true
  }

  export type NotificacionSumAggregateInputType = {
    id?: true
    referenciaId?: true
    mensajeId?: true
    usuarioId?: true
  }

  export type NotificacionMinAggregateInputType = {
    id?: true
    tipo?: true
    contenido?: true
    fecha?: true
    vista?: true
    referenciaId?: true
    mensajeId?: true
    usuarioId?: true
  }

  export type NotificacionMaxAggregateInputType = {
    id?: true
    tipo?: true
    contenido?: true
    fecha?: true
    vista?: true
    referenciaId?: true
    mensajeId?: true
    usuarioId?: true
  }

  export type NotificacionCountAggregateInputType = {
    id?: true
    tipo?: true
    contenido?: true
    fecha?: true
    vista?: true
    referenciaId?: true
    mensajeId?: true
    usuarioId?: true
    _all?: true
  }

  export type NotificacionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notificacion to aggregate.
     */
    where?: NotificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notificacions to fetch.
     */
    orderBy?: NotificacionOrderByWithRelationInput | NotificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notificacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notificacions
    **/
    _count?: true | NotificacionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificacionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificacionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificacionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificacionMaxAggregateInputType
  }

  export type GetNotificacionAggregateType<T extends NotificacionAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificacion[P]>
      : GetScalarType<T[P], AggregateNotificacion[P]>
  }




  export type NotificacionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificacionWhereInput
    orderBy?: NotificacionOrderByWithAggregationInput | NotificacionOrderByWithAggregationInput[]
    by: NotificacionScalarFieldEnum[] | NotificacionScalarFieldEnum
    having?: NotificacionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificacionCountAggregateInputType | true
    _avg?: NotificacionAvgAggregateInputType
    _sum?: NotificacionSumAggregateInputType
    _min?: NotificacionMinAggregateInputType
    _max?: NotificacionMaxAggregateInputType
  }

  export type NotificacionGroupByOutputType = {
    id: number
    tipo: string
    contenido: string
    fecha: Date
    vista: boolean
    referenciaId: number | null
    mensajeId: number | null
    usuarioId: number
    _count: NotificacionCountAggregateOutputType | null
    _avg: NotificacionAvgAggregateOutputType | null
    _sum: NotificacionSumAggregateOutputType | null
    _min: NotificacionMinAggregateOutputType | null
    _max: NotificacionMaxAggregateOutputType | null
  }

  type GetNotificacionGroupByPayload<T extends NotificacionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificacionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificacionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificacionGroupByOutputType[P]>
            : GetScalarType<T[P], NotificacionGroupByOutputType[P]>
        }
      >
    >


  export type NotificacionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    contenido?: boolean
    fecha?: boolean
    vista?: boolean
    referenciaId?: boolean
    mensajeId?: boolean
    usuarioId?: boolean
    mensaje?: boolean | Notificacion$mensajeArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificacion"]>

  export type NotificacionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    contenido?: boolean
    fecha?: boolean
    vista?: boolean
    referenciaId?: boolean
    mensajeId?: boolean
    usuarioId?: boolean
    mensaje?: boolean | Notificacion$mensajeArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificacion"]>

  export type NotificacionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    contenido?: boolean
    fecha?: boolean
    vista?: boolean
    referenciaId?: boolean
    mensajeId?: boolean
    usuarioId?: boolean
    mensaje?: boolean | Notificacion$mensajeArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificacion"]>

  export type NotificacionSelectScalar = {
    id?: boolean
    tipo?: boolean
    contenido?: boolean
    fecha?: boolean
    vista?: boolean
    referenciaId?: boolean
    mensajeId?: boolean
    usuarioId?: boolean
  }

  export type NotificacionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tipo" | "contenido" | "fecha" | "vista" | "referenciaId" | "mensajeId" | "usuarioId", ExtArgs["result"]["notificacion"]>
  export type NotificacionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mensaje?: boolean | Notificacion$mensajeArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type NotificacionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mensaje?: boolean | Notificacion$mensajeArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type NotificacionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mensaje?: boolean | Notificacion$mensajeArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $NotificacionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notificacion"
    objects: {
      mensaje: Prisma.$MensajePayload<ExtArgs> | null
      usuario: Prisma.$UsuarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tipo: string
      contenido: string
      fecha: Date
      vista: boolean
      referenciaId: number | null
      mensajeId: number | null
      usuarioId: number
    }, ExtArgs["result"]["notificacion"]>
    composites: {}
  }

  type NotificacionGetPayload<S extends boolean | null | undefined | NotificacionDefaultArgs> = $Result.GetResult<Prisma.$NotificacionPayload, S>

  type NotificacionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificacionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificacionCountAggregateInputType | true
    }

  export interface NotificacionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notificacion'], meta: { name: 'Notificacion' } }
    /**
     * Find zero or one Notificacion that matches the filter.
     * @param {NotificacionFindUniqueArgs} args - Arguments to find a Notificacion
     * @example
     * // Get one Notificacion
     * const notificacion = await prisma.notificacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificacionFindUniqueArgs>(args: SelectSubset<T, NotificacionFindUniqueArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notificacion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificacionFindUniqueOrThrowArgs} args - Arguments to find a Notificacion
     * @example
     * // Get one Notificacion
     * const notificacion = await prisma.notificacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificacionFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificacionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notificacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificacionFindFirstArgs} args - Arguments to find a Notificacion
     * @example
     * // Get one Notificacion
     * const notificacion = await prisma.notificacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificacionFindFirstArgs>(args?: SelectSubset<T, NotificacionFindFirstArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notificacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificacionFindFirstOrThrowArgs} args - Arguments to find a Notificacion
     * @example
     * // Get one Notificacion
     * const notificacion = await prisma.notificacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificacionFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificacionFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notificacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notificacions
     * const notificacions = await prisma.notificacion.findMany()
     * 
     * // Get first 10 Notificacions
     * const notificacions = await prisma.notificacion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificacionWithIdOnly = await prisma.notificacion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificacionFindManyArgs>(args?: SelectSubset<T, NotificacionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notificacion.
     * @param {NotificacionCreateArgs} args - Arguments to create a Notificacion.
     * @example
     * // Create one Notificacion
     * const Notificacion = await prisma.notificacion.create({
     *   data: {
     *     // ... data to create a Notificacion
     *   }
     * })
     * 
     */
    create<T extends NotificacionCreateArgs>(args: SelectSubset<T, NotificacionCreateArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notificacions.
     * @param {NotificacionCreateManyArgs} args - Arguments to create many Notificacions.
     * @example
     * // Create many Notificacions
     * const notificacion = await prisma.notificacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificacionCreateManyArgs>(args?: SelectSubset<T, NotificacionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notificacions and returns the data saved in the database.
     * @param {NotificacionCreateManyAndReturnArgs} args - Arguments to create many Notificacions.
     * @example
     * // Create many Notificacions
     * const notificacion = await prisma.notificacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notificacions and only return the `id`
     * const notificacionWithIdOnly = await prisma.notificacion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificacionCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificacionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notificacion.
     * @param {NotificacionDeleteArgs} args - Arguments to delete one Notificacion.
     * @example
     * // Delete one Notificacion
     * const Notificacion = await prisma.notificacion.delete({
     *   where: {
     *     // ... filter to delete one Notificacion
     *   }
     * })
     * 
     */
    delete<T extends NotificacionDeleteArgs>(args: SelectSubset<T, NotificacionDeleteArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notificacion.
     * @param {NotificacionUpdateArgs} args - Arguments to update one Notificacion.
     * @example
     * // Update one Notificacion
     * const notificacion = await prisma.notificacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificacionUpdateArgs>(args: SelectSubset<T, NotificacionUpdateArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notificacions.
     * @param {NotificacionDeleteManyArgs} args - Arguments to filter Notificacions to delete.
     * @example
     * // Delete a few Notificacions
     * const { count } = await prisma.notificacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificacionDeleteManyArgs>(args?: SelectSubset<T, NotificacionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notificacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notificacions
     * const notificacion = await prisma.notificacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificacionUpdateManyArgs>(args: SelectSubset<T, NotificacionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notificacions and returns the data updated in the database.
     * @param {NotificacionUpdateManyAndReturnArgs} args - Arguments to update many Notificacions.
     * @example
     * // Update many Notificacions
     * const notificacion = await prisma.notificacion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notificacions and only return the `id`
     * const notificacionWithIdOnly = await prisma.notificacion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificacionUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificacionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notificacion.
     * @param {NotificacionUpsertArgs} args - Arguments to update or create a Notificacion.
     * @example
     * // Update or create a Notificacion
     * const notificacion = await prisma.notificacion.upsert({
     *   create: {
     *     // ... data to create a Notificacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notificacion we want to update
     *   }
     * })
     */
    upsert<T extends NotificacionUpsertArgs>(args: SelectSubset<T, NotificacionUpsertArgs<ExtArgs>>): Prisma__NotificacionClient<$Result.GetResult<Prisma.$NotificacionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notificacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificacionCountArgs} args - Arguments to filter Notificacions to count.
     * @example
     * // Count the number of Notificacions
     * const count = await prisma.notificacion.count({
     *   where: {
     *     // ... the filter for the Notificacions we want to count
     *   }
     * })
    **/
    count<T extends NotificacionCountArgs>(
      args?: Subset<T, NotificacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificacionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notificacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificacionAggregateArgs>(args: Subset<T, NotificacionAggregateArgs>): Prisma.PrismaPromise<GetNotificacionAggregateType<T>>

    /**
     * Group by Notificacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificacionGroupByArgs['orderBy'] }
        : { orderBy?: NotificacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificacionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificacionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notificacion model
   */
  readonly fields: NotificacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notificacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificacionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mensaje<T extends Notificacion$mensajeArgs<ExtArgs> = {}>(args?: Subset<T, Notificacion$mensajeArgs<ExtArgs>>): Prisma__MensajeClient<$Result.GetResult<Prisma.$MensajePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notificacion model
   */
  interface NotificacionFieldRefs {
    readonly id: FieldRef<"Notificacion", 'Int'>
    readonly tipo: FieldRef<"Notificacion", 'String'>
    readonly contenido: FieldRef<"Notificacion", 'String'>
    readonly fecha: FieldRef<"Notificacion", 'DateTime'>
    readonly vista: FieldRef<"Notificacion", 'Boolean'>
    readonly referenciaId: FieldRef<"Notificacion", 'Int'>
    readonly mensajeId: FieldRef<"Notificacion", 'Int'>
    readonly usuarioId: FieldRef<"Notificacion", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Notificacion findUnique
   */
  export type NotificacionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * Filter, which Notificacion to fetch.
     */
    where: NotificacionWhereUniqueInput
  }

  /**
   * Notificacion findUniqueOrThrow
   */
  export type NotificacionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * Filter, which Notificacion to fetch.
     */
    where: NotificacionWhereUniqueInput
  }

  /**
   * Notificacion findFirst
   */
  export type NotificacionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * Filter, which Notificacion to fetch.
     */
    where?: NotificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notificacions to fetch.
     */
    orderBy?: NotificacionOrderByWithRelationInput | NotificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notificacions.
     */
    cursor?: NotificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notificacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notificacions.
     */
    distinct?: NotificacionScalarFieldEnum | NotificacionScalarFieldEnum[]
  }

  /**
   * Notificacion findFirstOrThrow
   */
  export type NotificacionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * Filter, which Notificacion to fetch.
     */
    where?: NotificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notificacions to fetch.
     */
    orderBy?: NotificacionOrderByWithRelationInput | NotificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notificacions.
     */
    cursor?: NotificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notificacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notificacions.
     */
    distinct?: NotificacionScalarFieldEnum | NotificacionScalarFieldEnum[]
  }

  /**
   * Notificacion findMany
   */
  export type NotificacionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * Filter, which Notificacions to fetch.
     */
    where?: NotificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notificacions to fetch.
     */
    orderBy?: NotificacionOrderByWithRelationInput | NotificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notificacions.
     */
    cursor?: NotificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notificacions.
     */
    skip?: number
    distinct?: NotificacionScalarFieldEnum | NotificacionScalarFieldEnum[]
  }

  /**
   * Notificacion create
   */
  export type NotificacionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * The data needed to create a Notificacion.
     */
    data: XOR<NotificacionCreateInput, NotificacionUncheckedCreateInput>
  }

  /**
   * Notificacion createMany
   */
  export type NotificacionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notificacions.
     */
    data: NotificacionCreateManyInput | NotificacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notificacion createManyAndReturn
   */
  export type NotificacionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * The data used to create many Notificacions.
     */
    data: NotificacionCreateManyInput | NotificacionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notificacion update
   */
  export type NotificacionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * The data needed to update a Notificacion.
     */
    data: XOR<NotificacionUpdateInput, NotificacionUncheckedUpdateInput>
    /**
     * Choose, which Notificacion to update.
     */
    where: NotificacionWhereUniqueInput
  }

  /**
   * Notificacion updateMany
   */
  export type NotificacionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notificacions.
     */
    data: XOR<NotificacionUpdateManyMutationInput, NotificacionUncheckedUpdateManyInput>
    /**
     * Filter which Notificacions to update
     */
    where?: NotificacionWhereInput
    /**
     * Limit how many Notificacions to update.
     */
    limit?: number
  }

  /**
   * Notificacion updateManyAndReturn
   */
  export type NotificacionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * The data used to update Notificacions.
     */
    data: XOR<NotificacionUpdateManyMutationInput, NotificacionUncheckedUpdateManyInput>
    /**
     * Filter which Notificacions to update
     */
    where?: NotificacionWhereInput
    /**
     * Limit how many Notificacions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notificacion upsert
   */
  export type NotificacionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * The filter to search for the Notificacion to update in case it exists.
     */
    where: NotificacionWhereUniqueInput
    /**
     * In case the Notificacion found by the `where` argument doesn't exist, create a new Notificacion with this data.
     */
    create: XOR<NotificacionCreateInput, NotificacionUncheckedCreateInput>
    /**
     * In case the Notificacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificacionUpdateInput, NotificacionUncheckedUpdateInput>
  }

  /**
   * Notificacion delete
   */
  export type NotificacionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
    /**
     * Filter which Notificacion to delete.
     */
    where: NotificacionWhereUniqueInput
  }

  /**
   * Notificacion deleteMany
   */
  export type NotificacionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notificacions to delete
     */
    where?: NotificacionWhereInput
    /**
     * Limit how many Notificacions to delete.
     */
    limit?: number
  }

  /**
   * Notificacion.mensaje
   */
  export type Notificacion$mensajeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mensaje
     */
    select?: MensajeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mensaje
     */
    omit?: MensajeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MensajeInclude<ExtArgs> | null
    where?: MensajeWhereInput
  }

  /**
   * Notificacion without action
   */
  export type NotificacionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notificacion
     */
    select?: NotificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notificacion
     */
    omit?: NotificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificacionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    nombres: 'nombres',
    apellidos: 'apellidos',
    usuario: 'usuario',
    correo: 'correo',
    password: 'password',
    firebaseUid: 'firebaseUid',
    rol: 'rol'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const EmpresaScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    nombre: 'nombre',
    phones: 'phones',
    contactName: 'contactName',
    nit: 'nit',
    address: 'address',
    city: 'city',
    department: 'department',
    companyType: 'companyType',
    economicSector: 'economicSector',
    foundationYear: 'foundationYear',
    employees: 'employees',
    annualRevenue: 'annualRevenue',
    totalAssets: 'totalAssets',
    equity: 'equity',
    distributionChannels: 'distributionChannels',
    mainClients: 'mainClients',
    emailAuthorization: 'emailAuthorization',
    createdAt: 'createdAt'
  };

  export type EmpresaScalarFieldEnum = (typeof EmpresaScalarFieldEnum)[keyof typeof EmpresaScalarFieldEnum]


  export const VacanteScalarFieldEnum: {
    id: 'id',
    titulo: 'titulo',
    descripcion: 'descripcion',
    ubicacion: 'ubicacion',
    tipo: 'tipo',
    modalidad: 'modalidad',
    salario: 'salario',
    fechaCreacion: 'fechaCreacion',
    empresaId: 'empresaId'
  };

  export type VacanteScalarFieldEnum = (typeof VacanteScalarFieldEnum)[keyof typeof VacanteScalarFieldEnum]


  export const PostulacionScalarFieldEnum: {
    id: 'id',
    telefono: 'telefono',
    cv_url: 'cv_url',
    estado: 'estado',
    fecha: 'fecha',
    vacanteId: 'vacanteId',
    usuarioId: 'usuarioId'
  };

  export type PostulacionScalarFieldEnum = (typeof PostulacionScalarFieldEnum)[keyof typeof PostulacionScalarFieldEnum]


  export const MensajeScalarFieldEnum: {
    id: 'id',
    contenido: 'contenido',
    fechaEnvio: 'fechaEnvio',
    read: 'read',
    senderType: 'senderType',
    senderEmpresaId: 'senderEmpresaId',
    senderUsuarioId: 'senderUsuarioId',
    receiverId: 'receiverId'
  };

  export type MensajeScalarFieldEnum = (typeof MensajeScalarFieldEnum)[keyof typeof MensajeScalarFieldEnum]


  export const NotificacionScalarFieldEnum: {
    id: 'id',
    tipo: 'tipo',
    contenido: 'contenido',
    fecha: 'fecha',
    vista: 'vista',
    referenciaId: 'referenciaId',
    mensajeId: 'mensajeId',
    usuarioId: 'usuarioId'
  };

  export type NotificacionScalarFieldEnum = (typeof NotificacionScalarFieldEnum)[keyof typeof NotificacionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: IntFilter<"Usuario"> | number
    nombres?: StringFilter<"Usuario"> | string
    apellidos?: StringFilter<"Usuario"> | string
    usuario?: StringFilter<"Usuario"> | string
    correo?: StringFilter<"Usuario"> | string
    password?: StringNullableFilter<"Usuario"> | string | null
    firebaseUid?: StringNullableFilter<"Usuario"> | string | null
    rol?: StringFilter<"Usuario"> | string
    postulaciones?: PostulacionListRelationFilter
    mensajesEnviados?: MensajeListRelationFilter
    mensajesRecibidos?: MensajeListRelationFilter
    notificaciones?: NotificacionListRelationFilter
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    usuario?: SortOrder
    correo?: SortOrder
    password?: SortOrderInput | SortOrder
    firebaseUid?: SortOrderInput | SortOrder
    rol?: SortOrder
    postulaciones?: PostulacionOrderByRelationAggregateInput
    mensajesEnviados?: MensajeOrderByRelationAggregateInput
    mensajesRecibidos?: MensajeOrderByRelationAggregateInput
    notificaciones?: NotificacionOrderByRelationAggregateInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    usuario?: string
    correo?: string
    firebaseUid?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nombres?: StringFilter<"Usuario"> | string
    apellidos?: StringFilter<"Usuario"> | string
    password?: StringNullableFilter<"Usuario"> | string | null
    rol?: StringFilter<"Usuario"> | string
    postulaciones?: PostulacionListRelationFilter
    mensajesEnviados?: MensajeListRelationFilter
    mensajesRecibidos?: MensajeListRelationFilter
    notificaciones?: NotificacionListRelationFilter
  }, "id" | "usuario" | "correo" | "firebaseUid">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    usuario?: SortOrder
    correo?: SortOrder
    password?: SortOrderInput | SortOrder
    firebaseUid?: SortOrderInput | SortOrder
    rol?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Usuario"> | number
    nombres?: StringWithAggregatesFilter<"Usuario"> | string
    apellidos?: StringWithAggregatesFilter<"Usuario"> | string
    usuario?: StringWithAggregatesFilter<"Usuario"> | string
    correo?: StringWithAggregatesFilter<"Usuario"> | string
    password?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    firebaseUid?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    rol?: StringWithAggregatesFilter<"Usuario"> | string
  }

  export type EmpresaWhereInput = {
    AND?: EmpresaWhereInput | EmpresaWhereInput[]
    OR?: EmpresaWhereInput[]
    NOT?: EmpresaWhereInput | EmpresaWhereInput[]
    id?: IntFilter<"Empresa"> | number
    email?: StringFilter<"Empresa"> | string
    password?: StringFilter<"Empresa"> | string
    nombre?: StringFilter<"Empresa"> | string
    phones?: StringFilter<"Empresa"> | string
    contactName?: StringFilter<"Empresa"> | string
    nit?: StringNullableFilter<"Empresa"> | string | null
    address?: StringFilter<"Empresa"> | string
    city?: StringFilter<"Empresa"> | string
    department?: StringFilter<"Empresa"> | string
    companyType?: StringFilter<"Empresa"> | string
    economicSector?: StringNullableListFilter<"Empresa">
    foundationYear?: IntFilter<"Empresa"> | number
    employees?: StringFilter<"Empresa"> | string
    annualRevenue?: StringFilter<"Empresa"> | string
    totalAssets?: StringNullableFilter<"Empresa"> | string | null
    equity?: StringNullableFilter<"Empresa"> | string | null
    distributionChannels?: StringNullableListFilter<"Empresa">
    mainClients?: StringFilter<"Empresa"> | string
    emailAuthorization?: BoolFilter<"Empresa"> | boolean
    createdAt?: DateTimeFilter<"Empresa"> | Date | string
    vacantes?: VacanteListRelationFilter
    mensajesEnviados?: MensajeListRelationFilter
  }

  export type EmpresaOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nombre?: SortOrder
    phones?: SortOrder
    contactName?: SortOrder
    nit?: SortOrderInput | SortOrder
    address?: SortOrder
    city?: SortOrder
    department?: SortOrder
    companyType?: SortOrder
    economicSector?: SortOrder
    foundationYear?: SortOrder
    employees?: SortOrder
    annualRevenue?: SortOrder
    totalAssets?: SortOrderInput | SortOrder
    equity?: SortOrderInput | SortOrder
    distributionChannels?: SortOrder
    mainClients?: SortOrder
    emailAuthorization?: SortOrder
    createdAt?: SortOrder
    vacantes?: VacanteOrderByRelationAggregateInput
    mensajesEnviados?: MensajeOrderByRelationAggregateInput
  }

  export type EmpresaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    nit?: string
    AND?: EmpresaWhereInput | EmpresaWhereInput[]
    OR?: EmpresaWhereInput[]
    NOT?: EmpresaWhereInput | EmpresaWhereInput[]
    password?: StringFilter<"Empresa"> | string
    nombre?: StringFilter<"Empresa"> | string
    phones?: StringFilter<"Empresa"> | string
    contactName?: StringFilter<"Empresa"> | string
    address?: StringFilter<"Empresa"> | string
    city?: StringFilter<"Empresa"> | string
    department?: StringFilter<"Empresa"> | string
    companyType?: StringFilter<"Empresa"> | string
    economicSector?: StringNullableListFilter<"Empresa">
    foundationYear?: IntFilter<"Empresa"> | number
    employees?: StringFilter<"Empresa"> | string
    annualRevenue?: StringFilter<"Empresa"> | string
    totalAssets?: StringNullableFilter<"Empresa"> | string | null
    equity?: StringNullableFilter<"Empresa"> | string | null
    distributionChannels?: StringNullableListFilter<"Empresa">
    mainClients?: StringFilter<"Empresa"> | string
    emailAuthorization?: BoolFilter<"Empresa"> | boolean
    createdAt?: DateTimeFilter<"Empresa"> | Date | string
    vacantes?: VacanteListRelationFilter
    mensajesEnviados?: MensajeListRelationFilter
  }, "id" | "email" | "nit">

  export type EmpresaOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nombre?: SortOrder
    phones?: SortOrder
    contactName?: SortOrder
    nit?: SortOrderInput | SortOrder
    address?: SortOrder
    city?: SortOrder
    department?: SortOrder
    companyType?: SortOrder
    economicSector?: SortOrder
    foundationYear?: SortOrder
    employees?: SortOrder
    annualRevenue?: SortOrder
    totalAssets?: SortOrderInput | SortOrder
    equity?: SortOrderInput | SortOrder
    distributionChannels?: SortOrder
    mainClients?: SortOrder
    emailAuthorization?: SortOrder
    createdAt?: SortOrder
    _count?: EmpresaCountOrderByAggregateInput
    _avg?: EmpresaAvgOrderByAggregateInput
    _max?: EmpresaMaxOrderByAggregateInput
    _min?: EmpresaMinOrderByAggregateInput
    _sum?: EmpresaSumOrderByAggregateInput
  }

  export type EmpresaScalarWhereWithAggregatesInput = {
    AND?: EmpresaScalarWhereWithAggregatesInput | EmpresaScalarWhereWithAggregatesInput[]
    OR?: EmpresaScalarWhereWithAggregatesInput[]
    NOT?: EmpresaScalarWhereWithAggregatesInput | EmpresaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Empresa"> | number
    email?: StringWithAggregatesFilter<"Empresa"> | string
    password?: StringWithAggregatesFilter<"Empresa"> | string
    nombre?: StringWithAggregatesFilter<"Empresa"> | string
    phones?: StringWithAggregatesFilter<"Empresa"> | string
    contactName?: StringWithAggregatesFilter<"Empresa"> | string
    nit?: StringNullableWithAggregatesFilter<"Empresa"> | string | null
    address?: StringWithAggregatesFilter<"Empresa"> | string
    city?: StringWithAggregatesFilter<"Empresa"> | string
    department?: StringWithAggregatesFilter<"Empresa"> | string
    companyType?: StringWithAggregatesFilter<"Empresa"> | string
    economicSector?: StringNullableListFilter<"Empresa">
    foundationYear?: IntWithAggregatesFilter<"Empresa"> | number
    employees?: StringWithAggregatesFilter<"Empresa"> | string
    annualRevenue?: StringWithAggregatesFilter<"Empresa"> | string
    totalAssets?: StringNullableWithAggregatesFilter<"Empresa"> | string | null
    equity?: StringNullableWithAggregatesFilter<"Empresa"> | string | null
    distributionChannels?: StringNullableListFilter<"Empresa">
    mainClients?: StringWithAggregatesFilter<"Empresa"> | string
    emailAuthorization?: BoolWithAggregatesFilter<"Empresa"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Empresa"> | Date | string
  }

  export type VacanteWhereInput = {
    AND?: VacanteWhereInput | VacanteWhereInput[]
    OR?: VacanteWhereInput[]
    NOT?: VacanteWhereInput | VacanteWhereInput[]
    id?: IntFilter<"Vacante"> | number
    titulo?: StringFilter<"Vacante"> | string
    descripcion?: StringFilter<"Vacante"> | string
    ubicacion?: StringFilter<"Vacante"> | string
    tipo?: StringFilter<"Vacante"> | string
    modalidad?: StringFilter<"Vacante"> | string
    salario?: StringNullableFilter<"Vacante"> | string | null
    fechaCreacion?: DateTimeFilter<"Vacante"> | Date | string
    empresaId?: IntFilter<"Vacante"> | number
    empresa?: XOR<EmpresaScalarRelationFilter, EmpresaWhereInput>
    postulaciones?: PostulacionListRelationFilter
  }

  export type VacanteOrderByWithRelationInput = {
    id?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    modalidad?: SortOrder
    salario?: SortOrderInput | SortOrder
    fechaCreacion?: SortOrder
    empresaId?: SortOrder
    empresa?: EmpresaOrderByWithRelationInput
    postulaciones?: PostulacionOrderByRelationAggregateInput
  }

  export type VacanteWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: VacanteWhereInput | VacanteWhereInput[]
    OR?: VacanteWhereInput[]
    NOT?: VacanteWhereInput | VacanteWhereInput[]
    titulo?: StringFilter<"Vacante"> | string
    descripcion?: StringFilter<"Vacante"> | string
    ubicacion?: StringFilter<"Vacante"> | string
    tipo?: StringFilter<"Vacante"> | string
    modalidad?: StringFilter<"Vacante"> | string
    salario?: StringNullableFilter<"Vacante"> | string | null
    fechaCreacion?: DateTimeFilter<"Vacante"> | Date | string
    empresaId?: IntFilter<"Vacante"> | number
    empresa?: XOR<EmpresaScalarRelationFilter, EmpresaWhereInput>
    postulaciones?: PostulacionListRelationFilter
  }, "id">

  export type VacanteOrderByWithAggregationInput = {
    id?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    modalidad?: SortOrder
    salario?: SortOrderInput | SortOrder
    fechaCreacion?: SortOrder
    empresaId?: SortOrder
    _count?: VacanteCountOrderByAggregateInput
    _avg?: VacanteAvgOrderByAggregateInput
    _max?: VacanteMaxOrderByAggregateInput
    _min?: VacanteMinOrderByAggregateInput
    _sum?: VacanteSumOrderByAggregateInput
  }

  export type VacanteScalarWhereWithAggregatesInput = {
    AND?: VacanteScalarWhereWithAggregatesInput | VacanteScalarWhereWithAggregatesInput[]
    OR?: VacanteScalarWhereWithAggregatesInput[]
    NOT?: VacanteScalarWhereWithAggregatesInput | VacanteScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Vacante"> | number
    titulo?: StringWithAggregatesFilter<"Vacante"> | string
    descripcion?: StringWithAggregatesFilter<"Vacante"> | string
    ubicacion?: StringWithAggregatesFilter<"Vacante"> | string
    tipo?: StringWithAggregatesFilter<"Vacante"> | string
    modalidad?: StringWithAggregatesFilter<"Vacante"> | string
    salario?: StringNullableWithAggregatesFilter<"Vacante"> | string | null
    fechaCreacion?: DateTimeWithAggregatesFilter<"Vacante"> | Date | string
    empresaId?: IntWithAggregatesFilter<"Vacante"> | number
  }

  export type PostulacionWhereInput = {
    AND?: PostulacionWhereInput | PostulacionWhereInput[]
    OR?: PostulacionWhereInput[]
    NOT?: PostulacionWhereInput | PostulacionWhereInput[]
    id?: IntFilter<"Postulacion"> | number
    telefono?: StringNullableFilter<"Postulacion"> | string | null
    cv_url?: StringNullableFilter<"Postulacion"> | string | null
    estado?: StringFilter<"Postulacion"> | string
    fecha?: DateTimeFilter<"Postulacion"> | Date | string
    vacanteId?: IntFilter<"Postulacion"> | number
    usuarioId?: IntFilter<"Postulacion"> | number
    vacante?: XOR<VacanteScalarRelationFilter, VacanteWhereInput>
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }

  export type PostulacionOrderByWithRelationInput = {
    id?: SortOrder
    telefono?: SortOrderInput | SortOrder
    cv_url?: SortOrderInput | SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    vacanteId?: SortOrder
    usuarioId?: SortOrder
    vacante?: VacanteOrderByWithRelationInput
    usuario?: UsuarioOrderByWithRelationInput
  }

  export type PostulacionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PostulacionWhereInput | PostulacionWhereInput[]
    OR?: PostulacionWhereInput[]
    NOT?: PostulacionWhereInput | PostulacionWhereInput[]
    telefono?: StringNullableFilter<"Postulacion"> | string | null
    cv_url?: StringNullableFilter<"Postulacion"> | string | null
    estado?: StringFilter<"Postulacion"> | string
    fecha?: DateTimeFilter<"Postulacion"> | Date | string
    vacanteId?: IntFilter<"Postulacion"> | number
    usuarioId?: IntFilter<"Postulacion"> | number
    vacante?: XOR<VacanteScalarRelationFilter, VacanteWhereInput>
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }, "id">

  export type PostulacionOrderByWithAggregationInput = {
    id?: SortOrder
    telefono?: SortOrderInput | SortOrder
    cv_url?: SortOrderInput | SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    vacanteId?: SortOrder
    usuarioId?: SortOrder
    _count?: PostulacionCountOrderByAggregateInput
    _avg?: PostulacionAvgOrderByAggregateInput
    _max?: PostulacionMaxOrderByAggregateInput
    _min?: PostulacionMinOrderByAggregateInput
    _sum?: PostulacionSumOrderByAggregateInput
  }

  export type PostulacionScalarWhereWithAggregatesInput = {
    AND?: PostulacionScalarWhereWithAggregatesInput | PostulacionScalarWhereWithAggregatesInput[]
    OR?: PostulacionScalarWhereWithAggregatesInput[]
    NOT?: PostulacionScalarWhereWithAggregatesInput | PostulacionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Postulacion"> | number
    telefono?: StringNullableWithAggregatesFilter<"Postulacion"> | string | null
    cv_url?: StringNullableWithAggregatesFilter<"Postulacion"> | string | null
    estado?: StringWithAggregatesFilter<"Postulacion"> | string
    fecha?: DateTimeWithAggregatesFilter<"Postulacion"> | Date | string
    vacanteId?: IntWithAggregatesFilter<"Postulacion"> | number
    usuarioId?: IntWithAggregatesFilter<"Postulacion"> | number
  }

  export type MensajeWhereInput = {
    AND?: MensajeWhereInput | MensajeWhereInput[]
    OR?: MensajeWhereInput[]
    NOT?: MensajeWhereInput | MensajeWhereInput[]
    id?: IntFilter<"Mensaje"> | number
    contenido?: StringFilter<"Mensaje"> | string
    fechaEnvio?: DateTimeFilter<"Mensaje"> | Date | string
    read?: BoolFilter<"Mensaje"> | boolean
    senderType?: StringFilter<"Mensaje"> | string
    senderEmpresaId?: IntNullableFilter<"Mensaje"> | number | null
    senderUsuarioId?: IntNullableFilter<"Mensaje"> | number | null
    receiverId?: IntFilter<"Mensaje"> | number
    senderEmpresa?: XOR<EmpresaNullableScalarRelationFilter, EmpresaWhereInput> | null
    senderUsuario?: XOR<UsuarioNullableScalarRelationFilter, UsuarioWhereInput> | null
    receiver?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    notificacion?: XOR<NotificacionNullableScalarRelationFilter, NotificacionWhereInput> | null
  }

  export type MensajeOrderByWithRelationInput = {
    id?: SortOrder
    contenido?: SortOrder
    fechaEnvio?: SortOrder
    read?: SortOrder
    senderType?: SortOrder
    senderEmpresaId?: SortOrderInput | SortOrder
    senderUsuarioId?: SortOrderInput | SortOrder
    receiverId?: SortOrder
    senderEmpresa?: EmpresaOrderByWithRelationInput
    senderUsuario?: UsuarioOrderByWithRelationInput
    receiver?: UsuarioOrderByWithRelationInput
    notificacion?: NotificacionOrderByWithRelationInput
  }

  export type MensajeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MensajeWhereInput | MensajeWhereInput[]
    OR?: MensajeWhereInput[]
    NOT?: MensajeWhereInput | MensajeWhereInput[]
    contenido?: StringFilter<"Mensaje"> | string
    fechaEnvio?: DateTimeFilter<"Mensaje"> | Date | string
    read?: BoolFilter<"Mensaje"> | boolean
    senderType?: StringFilter<"Mensaje"> | string
    senderEmpresaId?: IntNullableFilter<"Mensaje"> | number | null
    senderUsuarioId?: IntNullableFilter<"Mensaje"> | number | null
    receiverId?: IntFilter<"Mensaje"> | number
    senderEmpresa?: XOR<EmpresaNullableScalarRelationFilter, EmpresaWhereInput> | null
    senderUsuario?: XOR<UsuarioNullableScalarRelationFilter, UsuarioWhereInput> | null
    receiver?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    notificacion?: XOR<NotificacionNullableScalarRelationFilter, NotificacionWhereInput> | null
  }, "id">

  export type MensajeOrderByWithAggregationInput = {
    id?: SortOrder
    contenido?: SortOrder
    fechaEnvio?: SortOrder
    read?: SortOrder
    senderType?: SortOrder
    senderEmpresaId?: SortOrderInput | SortOrder
    senderUsuarioId?: SortOrderInput | SortOrder
    receiverId?: SortOrder
    _count?: MensajeCountOrderByAggregateInput
    _avg?: MensajeAvgOrderByAggregateInput
    _max?: MensajeMaxOrderByAggregateInput
    _min?: MensajeMinOrderByAggregateInput
    _sum?: MensajeSumOrderByAggregateInput
  }

  export type MensajeScalarWhereWithAggregatesInput = {
    AND?: MensajeScalarWhereWithAggregatesInput | MensajeScalarWhereWithAggregatesInput[]
    OR?: MensajeScalarWhereWithAggregatesInput[]
    NOT?: MensajeScalarWhereWithAggregatesInput | MensajeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Mensaje"> | number
    contenido?: StringWithAggregatesFilter<"Mensaje"> | string
    fechaEnvio?: DateTimeWithAggregatesFilter<"Mensaje"> | Date | string
    read?: BoolWithAggregatesFilter<"Mensaje"> | boolean
    senderType?: StringWithAggregatesFilter<"Mensaje"> | string
    senderEmpresaId?: IntNullableWithAggregatesFilter<"Mensaje"> | number | null
    senderUsuarioId?: IntNullableWithAggregatesFilter<"Mensaje"> | number | null
    receiverId?: IntWithAggregatesFilter<"Mensaje"> | number
  }

  export type NotificacionWhereInput = {
    AND?: NotificacionWhereInput | NotificacionWhereInput[]
    OR?: NotificacionWhereInput[]
    NOT?: NotificacionWhereInput | NotificacionWhereInput[]
    id?: IntFilter<"Notificacion"> | number
    tipo?: StringFilter<"Notificacion"> | string
    contenido?: StringFilter<"Notificacion"> | string
    fecha?: DateTimeFilter<"Notificacion"> | Date | string
    vista?: BoolFilter<"Notificacion"> | boolean
    referenciaId?: IntNullableFilter<"Notificacion"> | number | null
    mensajeId?: IntNullableFilter<"Notificacion"> | number | null
    usuarioId?: IntFilter<"Notificacion"> | number
    mensaje?: XOR<MensajeNullableScalarRelationFilter, MensajeWhereInput> | null
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }

  export type NotificacionOrderByWithRelationInput = {
    id?: SortOrder
    tipo?: SortOrder
    contenido?: SortOrder
    fecha?: SortOrder
    vista?: SortOrder
    referenciaId?: SortOrderInput | SortOrder
    mensajeId?: SortOrderInput | SortOrder
    usuarioId?: SortOrder
    mensaje?: MensajeOrderByWithRelationInput
    usuario?: UsuarioOrderByWithRelationInput
  }

  export type NotificacionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    mensajeId?: number
    AND?: NotificacionWhereInput | NotificacionWhereInput[]
    OR?: NotificacionWhereInput[]
    NOT?: NotificacionWhereInput | NotificacionWhereInput[]
    tipo?: StringFilter<"Notificacion"> | string
    contenido?: StringFilter<"Notificacion"> | string
    fecha?: DateTimeFilter<"Notificacion"> | Date | string
    vista?: BoolFilter<"Notificacion"> | boolean
    referenciaId?: IntNullableFilter<"Notificacion"> | number | null
    usuarioId?: IntFilter<"Notificacion"> | number
    mensaje?: XOR<MensajeNullableScalarRelationFilter, MensajeWhereInput> | null
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }, "id" | "mensajeId">

  export type NotificacionOrderByWithAggregationInput = {
    id?: SortOrder
    tipo?: SortOrder
    contenido?: SortOrder
    fecha?: SortOrder
    vista?: SortOrder
    referenciaId?: SortOrderInput | SortOrder
    mensajeId?: SortOrderInput | SortOrder
    usuarioId?: SortOrder
    _count?: NotificacionCountOrderByAggregateInput
    _avg?: NotificacionAvgOrderByAggregateInput
    _max?: NotificacionMaxOrderByAggregateInput
    _min?: NotificacionMinOrderByAggregateInput
    _sum?: NotificacionSumOrderByAggregateInput
  }

  export type NotificacionScalarWhereWithAggregatesInput = {
    AND?: NotificacionScalarWhereWithAggregatesInput | NotificacionScalarWhereWithAggregatesInput[]
    OR?: NotificacionScalarWhereWithAggregatesInput[]
    NOT?: NotificacionScalarWhereWithAggregatesInput | NotificacionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notificacion"> | number
    tipo?: StringWithAggregatesFilter<"Notificacion"> | string
    contenido?: StringWithAggregatesFilter<"Notificacion"> | string
    fecha?: DateTimeWithAggregatesFilter<"Notificacion"> | Date | string
    vista?: BoolWithAggregatesFilter<"Notificacion"> | boolean
    referenciaId?: IntNullableWithAggregatesFilter<"Notificacion"> | number | null
    mensajeId?: IntNullableWithAggregatesFilter<"Notificacion"> | number | null
    usuarioId?: IntWithAggregatesFilter<"Notificacion"> | number
  }

  export type UsuarioCreateInput = {
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionCreateNestedManyWithoutUsuarioInput
    mensajesEnviados?: MensajeCreateNestedManyWithoutSenderUsuarioInput
    mensajesRecibidos?: MensajeCreateNestedManyWithoutReceiverInput
    notificaciones?: NotificacionCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateInput = {
    id?: number
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionUncheckedCreateNestedManyWithoutUsuarioInput
    mensajesEnviados?: MensajeUncheckedCreateNestedManyWithoutSenderUsuarioInput
    mensajesRecibidos?: MensajeUncheckedCreateNestedManyWithoutReceiverInput
    notificaciones?: NotificacionUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUpdateInput = {
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUpdateManyWithoutUsuarioNestedInput
    mensajesEnviados?: MensajeUpdateManyWithoutSenderUsuarioNestedInput
    mensajesRecibidos?: MensajeUpdateManyWithoutReceiverNestedInput
    notificaciones?: NotificacionUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUncheckedUpdateManyWithoutUsuarioNestedInput
    mensajesEnviados?: MensajeUncheckedUpdateManyWithoutSenderUsuarioNestedInput
    mensajesRecibidos?: MensajeUncheckedUpdateManyWithoutReceiverNestedInput
    notificaciones?: NotificacionUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioCreateManyInput = {
    id?: number
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
  }

  export type UsuarioUpdateManyMutationInput = {
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
  }

  export type EmpresaCreateInput = {
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit?: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector?: EmpresaCreateeconomicSectorInput | string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets?: string | null
    equity?: string | null
    distributionChannels?: EmpresaCreatedistributionChannelsInput | string[]
    mainClients: string
    emailAuthorization?: boolean
    createdAt?: Date | string
    vacantes?: VacanteCreateNestedManyWithoutEmpresaInput
    mensajesEnviados?: MensajeCreateNestedManyWithoutSenderEmpresaInput
  }

  export type EmpresaUncheckedCreateInput = {
    id?: number
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit?: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector?: EmpresaCreateeconomicSectorInput | string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets?: string | null
    equity?: string | null
    distributionChannels?: EmpresaCreatedistributionChannelsInput | string[]
    mainClients: string
    emailAuthorization?: boolean
    createdAt?: Date | string
    vacantes?: VacanteUncheckedCreateNestedManyWithoutEmpresaInput
    mensajesEnviados?: MensajeUncheckedCreateNestedManyWithoutSenderEmpresaInput
  }

  export type EmpresaUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vacantes?: VacanteUpdateManyWithoutEmpresaNestedInput
    mensajesEnviados?: MensajeUpdateManyWithoutSenderEmpresaNestedInput
  }

  export type EmpresaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vacantes?: VacanteUncheckedUpdateManyWithoutEmpresaNestedInput
    mensajesEnviados?: MensajeUncheckedUpdateManyWithoutSenderEmpresaNestedInput
  }

  export type EmpresaCreateManyInput = {
    id?: number
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit?: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector?: EmpresaCreateeconomicSectorInput | string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets?: string | null
    equity?: string | null
    distributionChannels?: EmpresaCreatedistributionChannelsInput | string[]
    mainClients: string
    emailAuthorization?: boolean
    createdAt?: Date | string
  }

  export type EmpresaUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmpresaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VacanteCreateInput = {
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
    empresa: EmpresaCreateNestedOneWithoutVacantesInput
    postulaciones?: PostulacionCreateNestedManyWithoutVacanteInput
  }

  export type VacanteUncheckedCreateInput = {
    id?: number
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
    empresaId: number
    postulaciones?: PostulacionUncheckedCreateNestedManyWithoutVacanteInput
  }

  export type VacanteUpdateInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    empresa?: EmpresaUpdateOneRequiredWithoutVacantesNestedInput
    postulaciones?: PostulacionUpdateManyWithoutVacanteNestedInput
  }

  export type VacanteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    empresaId?: IntFieldUpdateOperationsInput | number
    postulaciones?: PostulacionUncheckedUpdateManyWithoutVacanteNestedInput
  }

  export type VacanteCreateManyInput = {
    id?: number
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
    empresaId: number
  }

  export type VacanteUpdateManyMutationInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VacanteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    empresaId?: IntFieldUpdateOperationsInput | number
  }

  export type PostulacionCreateInput = {
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    vacante: VacanteCreateNestedOneWithoutPostulacionesInput
    usuario: UsuarioCreateNestedOneWithoutPostulacionesInput
  }

  export type PostulacionUncheckedCreateInput = {
    id?: number
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    vacanteId: number
    usuarioId: number
  }

  export type PostulacionUpdateInput = {
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vacante?: VacanteUpdateOneRequiredWithoutPostulacionesNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutPostulacionesNestedInput
  }

  export type PostulacionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vacanteId?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type PostulacionCreateManyInput = {
    id?: number
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    vacanteId: number
    usuarioId: number
  }

  export type PostulacionUpdateManyMutationInput = {
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostulacionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vacanteId?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type MensajeCreateInput = {
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresa?: EmpresaCreateNestedOneWithoutMensajesEnviadosInput
    senderUsuario?: UsuarioCreateNestedOneWithoutMensajesEnviadosInput
    receiver: UsuarioCreateNestedOneWithoutMensajesRecibidosInput
    notificacion?: NotificacionCreateNestedOneWithoutMensajeInput
  }

  export type MensajeUncheckedCreateInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresaId?: number | null
    senderUsuarioId?: number | null
    receiverId: number
    notificacion?: NotificacionUncheckedCreateNestedOneWithoutMensajeInput
  }

  export type MensajeUpdateInput = {
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresa?: EmpresaUpdateOneWithoutMensajesEnviadosNestedInput
    senderUsuario?: UsuarioUpdateOneWithoutMensajesEnviadosNestedInput
    receiver?: UsuarioUpdateOneRequiredWithoutMensajesRecibidosNestedInput
    notificacion?: NotificacionUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresaId?: NullableIntFieldUpdateOperationsInput | number | null
    senderUsuarioId?: NullableIntFieldUpdateOperationsInput | number | null
    receiverId?: IntFieldUpdateOperationsInput | number
    notificacion?: NotificacionUncheckedUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeCreateManyInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresaId?: number | null
    senderUsuarioId?: number | null
    receiverId: number
  }

  export type MensajeUpdateManyMutationInput = {
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
  }

  export type MensajeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresaId?: NullableIntFieldUpdateOperationsInput | number | null
    senderUsuarioId?: NullableIntFieldUpdateOperationsInput | number | null
    receiverId?: IntFieldUpdateOperationsInput | number
  }

  export type NotificacionCreateInput = {
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    mensaje?: MensajeCreateNestedOneWithoutNotificacionInput
    usuario: UsuarioCreateNestedOneWithoutNotificacionesInput
  }

  export type NotificacionUncheckedCreateInput = {
    id?: number
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    mensajeId?: number | null
    usuarioId: number
  }

  export type NotificacionUpdateInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    mensaje?: MensajeUpdateOneWithoutNotificacionNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutNotificacionesNestedInput
  }

  export type NotificacionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    mensajeId?: NullableIntFieldUpdateOperationsInput | number | null
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type NotificacionCreateManyInput = {
    id?: number
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    mensajeId?: number | null
    usuarioId: number
  }

  export type NotificacionUpdateManyMutationInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type NotificacionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    mensajeId?: NullableIntFieldUpdateOperationsInput | number | null
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type PostulacionListRelationFilter = {
    every?: PostulacionWhereInput
    some?: PostulacionWhereInput
    none?: PostulacionWhereInput
  }

  export type MensajeListRelationFilter = {
    every?: MensajeWhereInput
    some?: MensajeWhereInput
    none?: MensajeWhereInput
  }

  export type NotificacionListRelationFilter = {
    every?: NotificacionWhereInput
    some?: NotificacionWhereInput
    none?: NotificacionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PostulacionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MensajeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificacionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    usuario?: SortOrder
    correo?: SortOrder
    password?: SortOrder
    firebaseUid?: SortOrder
    rol?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    usuario?: SortOrder
    correo?: SortOrder
    password?: SortOrder
    firebaseUid?: SortOrder
    rol?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    usuario?: SortOrder
    correo?: SortOrder
    password?: SortOrder
    firebaseUid?: SortOrder
    rol?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type VacanteListRelationFilter = {
    every?: VacanteWhereInput
    some?: VacanteWhereInput
    none?: VacanteWhereInput
  }

  export type VacanteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmpresaCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nombre?: SortOrder
    phones?: SortOrder
    contactName?: SortOrder
    nit?: SortOrder
    address?: SortOrder
    city?: SortOrder
    department?: SortOrder
    companyType?: SortOrder
    economicSector?: SortOrder
    foundationYear?: SortOrder
    employees?: SortOrder
    annualRevenue?: SortOrder
    totalAssets?: SortOrder
    equity?: SortOrder
    distributionChannels?: SortOrder
    mainClients?: SortOrder
    emailAuthorization?: SortOrder
    createdAt?: SortOrder
  }

  export type EmpresaAvgOrderByAggregateInput = {
    id?: SortOrder
    foundationYear?: SortOrder
  }

  export type EmpresaMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nombre?: SortOrder
    phones?: SortOrder
    contactName?: SortOrder
    nit?: SortOrder
    address?: SortOrder
    city?: SortOrder
    department?: SortOrder
    companyType?: SortOrder
    foundationYear?: SortOrder
    employees?: SortOrder
    annualRevenue?: SortOrder
    totalAssets?: SortOrder
    equity?: SortOrder
    mainClients?: SortOrder
    emailAuthorization?: SortOrder
    createdAt?: SortOrder
  }

  export type EmpresaMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nombre?: SortOrder
    phones?: SortOrder
    contactName?: SortOrder
    nit?: SortOrder
    address?: SortOrder
    city?: SortOrder
    department?: SortOrder
    companyType?: SortOrder
    foundationYear?: SortOrder
    employees?: SortOrder
    annualRevenue?: SortOrder
    totalAssets?: SortOrder
    equity?: SortOrder
    mainClients?: SortOrder
    emailAuthorization?: SortOrder
    createdAt?: SortOrder
  }

  export type EmpresaSumOrderByAggregateInput = {
    id?: SortOrder
    foundationYear?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EmpresaScalarRelationFilter = {
    is?: EmpresaWhereInput
    isNot?: EmpresaWhereInput
  }

  export type VacanteCountOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    modalidad?: SortOrder
    salario?: SortOrder
    fechaCreacion?: SortOrder
    empresaId?: SortOrder
  }

  export type VacanteAvgOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
  }

  export type VacanteMaxOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    modalidad?: SortOrder
    salario?: SortOrder
    fechaCreacion?: SortOrder
    empresaId?: SortOrder
  }

  export type VacanteMinOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    modalidad?: SortOrder
    salario?: SortOrder
    fechaCreacion?: SortOrder
    empresaId?: SortOrder
  }

  export type VacanteSumOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
  }

  export type VacanteScalarRelationFilter = {
    is?: VacanteWhereInput
    isNot?: VacanteWhereInput
  }

  export type UsuarioScalarRelationFilter = {
    is?: UsuarioWhereInput
    isNot?: UsuarioWhereInput
  }

  export type PostulacionCountOrderByAggregateInput = {
    id?: SortOrder
    telefono?: SortOrder
    cv_url?: SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    vacanteId?: SortOrder
    usuarioId?: SortOrder
  }

  export type PostulacionAvgOrderByAggregateInput = {
    id?: SortOrder
    vacanteId?: SortOrder
    usuarioId?: SortOrder
  }

  export type PostulacionMaxOrderByAggregateInput = {
    id?: SortOrder
    telefono?: SortOrder
    cv_url?: SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    vacanteId?: SortOrder
    usuarioId?: SortOrder
  }

  export type PostulacionMinOrderByAggregateInput = {
    id?: SortOrder
    telefono?: SortOrder
    cv_url?: SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    vacanteId?: SortOrder
    usuarioId?: SortOrder
  }

  export type PostulacionSumOrderByAggregateInput = {
    id?: SortOrder
    vacanteId?: SortOrder
    usuarioId?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EmpresaNullableScalarRelationFilter = {
    is?: EmpresaWhereInput | null
    isNot?: EmpresaWhereInput | null
  }

  export type UsuarioNullableScalarRelationFilter = {
    is?: UsuarioWhereInput | null
    isNot?: UsuarioWhereInput | null
  }

  export type NotificacionNullableScalarRelationFilter = {
    is?: NotificacionWhereInput | null
    isNot?: NotificacionWhereInput | null
  }

  export type MensajeCountOrderByAggregateInput = {
    id?: SortOrder
    contenido?: SortOrder
    fechaEnvio?: SortOrder
    read?: SortOrder
    senderType?: SortOrder
    senderEmpresaId?: SortOrder
    senderUsuarioId?: SortOrder
    receiverId?: SortOrder
  }

  export type MensajeAvgOrderByAggregateInput = {
    id?: SortOrder
    senderEmpresaId?: SortOrder
    senderUsuarioId?: SortOrder
    receiverId?: SortOrder
  }

  export type MensajeMaxOrderByAggregateInput = {
    id?: SortOrder
    contenido?: SortOrder
    fechaEnvio?: SortOrder
    read?: SortOrder
    senderType?: SortOrder
    senderEmpresaId?: SortOrder
    senderUsuarioId?: SortOrder
    receiverId?: SortOrder
  }

  export type MensajeMinOrderByAggregateInput = {
    id?: SortOrder
    contenido?: SortOrder
    fechaEnvio?: SortOrder
    read?: SortOrder
    senderType?: SortOrder
    senderEmpresaId?: SortOrder
    senderUsuarioId?: SortOrder
    receiverId?: SortOrder
  }

  export type MensajeSumOrderByAggregateInput = {
    id?: SortOrder
    senderEmpresaId?: SortOrder
    senderUsuarioId?: SortOrder
    receiverId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type MensajeNullableScalarRelationFilter = {
    is?: MensajeWhereInput | null
    isNot?: MensajeWhereInput | null
  }

  export type NotificacionCountOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    contenido?: SortOrder
    fecha?: SortOrder
    vista?: SortOrder
    referenciaId?: SortOrder
    mensajeId?: SortOrder
    usuarioId?: SortOrder
  }

  export type NotificacionAvgOrderByAggregateInput = {
    id?: SortOrder
    referenciaId?: SortOrder
    mensajeId?: SortOrder
    usuarioId?: SortOrder
  }

  export type NotificacionMaxOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    contenido?: SortOrder
    fecha?: SortOrder
    vista?: SortOrder
    referenciaId?: SortOrder
    mensajeId?: SortOrder
    usuarioId?: SortOrder
  }

  export type NotificacionMinOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    contenido?: SortOrder
    fecha?: SortOrder
    vista?: SortOrder
    referenciaId?: SortOrder
    mensajeId?: SortOrder
    usuarioId?: SortOrder
  }

  export type NotificacionSumOrderByAggregateInput = {
    id?: SortOrder
    referenciaId?: SortOrder
    mensajeId?: SortOrder
    usuarioId?: SortOrder
  }

  export type PostulacionCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<PostulacionCreateWithoutUsuarioInput, PostulacionUncheckedCreateWithoutUsuarioInput> | PostulacionCreateWithoutUsuarioInput[] | PostulacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutUsuarioInput | PostulacionCreateOrConnectWithoutUsuarioInput[]
    createMany?: PostulacionCreateManyUsuarioInputEnvelope
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
  }

  export type MensajeCreateNestedManyWithoutSenderUsuarioInput = {
    create?: XOR<MensajeCreateWithoutSenderUsuarioInput, MensajeUncheckedCreateWithoutSenderUsuarioInput> | MensajeCreateWithoutSenderUsuarioInput[] | MensajeUncheckedCreateWithoutSenderUsuarioInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderUsuarioInput | MensajeCreateOrConnectWithoutSenderUsuarioInput[]
    createMany?: MensajeCreateManySenderUsuarioInputEnvelope
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
  }

  export type MensajeCreateNestedManyWithoutReceiverInput = {
    create?: XOR<MensajeCreateWithoutReceiverInput, MensajeUncheckedCreateWithoutReceiverInput> | MensajeCreateWithoutReceiverInput[] | MensajeUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutReceiverInput | MensajeCreateOrConnectWithoutReceiverInput[]
    createMany?: MensajeCreateManyReceiverInputEnvelope
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
  }

  export type NotificacionCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<NotificacionCreateWithoutUsuarioInput, NotificacionUncheckedCreateWithoutUsuarioInput> | NotificacionCreateWithoutUsuarioInput[] | NotificacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: NotificacionCreateOrConnectWithoutUsuarioInput | NotificacionCreateOrConnectWithoutUsuarioInput[]
    createMany?: NotificacionCreateManyUsuarioInputEnvelope
    connect?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
  }

  export type PostulacionUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<PostulacionCreateWithoutUsuarioInput, PostulacionUncheckedCreateWithoutUsuarioInput> | PostulacionCreateWithoutUsuarioInput[] | PostulacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutUsuarioInput | PostulacionCreateOrConnectWithoutUsuarioInput[]
    createMany?: PostulacionCreateManyUsuarioInputEnvelope
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
  }

  export type MensajeUncheckedCreateNestedManyWithoutSenderUsuarioInput = {
    create?: XOR<MensajeCreateWithoutSenderUsuarioInput, MensajeUncheckedCreateWithoutSenderUsuarioInput> | MensajeCreateWithoutSenderUsuarioInput[] | MensajeUncheckedCreateWithoutSenderUsuarioInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderUsuarioInput | MensajeCreateOrConnectWithoutSenderUsuarioInput[]
    createMany?: MensajeCreateManySenderUsuarioInputEnvelope
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
  }

  export type MensajeUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<MensajeCreateWithoutReceiverInput, MensajeUncheckedCreateWithoutReceiverInput> | MensajeCreateWithoutReceiverInput[] | MensajeUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutReceiverInput | MensajeCreateOrConnectWithoutReceiverInput[]
    createMany?: MensajeCreateManyReceiverInputEnvelope
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
  }

  export type NotificacionUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<NotificacionCreateWithoutUsuarioInput, NotificacionUncheckedCreateWithoutUsuarioInput> | NotificacionCreateWithoutUsuarioInput[] | NotificacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: NotificacionCreateOrConnectWithoutUsuarioInput | NotificacionCreateOrConnectWithoutUsuarioInput[]
    createMany?: NotificacionCreateManyUsuarioInputEnvelope
    connect?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type PostulacionUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<PostulacionCreateWithoutUsuarioInput, PostulacionUncheckedCreateWithoutUsuarioInput> | PostulacionCreateWithoutUsuarioInput[] | PostulacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutUsuarioInput | PostulacionCreateOrConnectWithoutUsuarioInput[]
    upsert?: PostulacionUpsertWithWhereUniqueWithoutUsuarioInput | PostulacionUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: PostulacionCreateManyUsuarioInputEnvelope
    set?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    disconnect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    delete?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    update?: PostulacionUpdateWithWhereUniqueWithoutUsuarioInput | PostulacionUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: PostulacionUpdateManyWithWhereWithoutUsuarioInput | PostulacionUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: PostulacionScalarWhereInput | PostulacionScalarWhereInput[]
  }

  export type MensajeUpdateManyWithoutSenderUsuarioNestedInput = {
    create?: XOR<MensajeCreateWithoutSenderUsuarioInput, MensajeUncheckedCreateWithoutSenderUsuarioInput> | MensajeCreateWithoutSenderUsuarioInput[] | MensajeUncheckedCreateWithoutSenderUsuarioInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderUsuarioInput | MensajeCreateOrConnectWithoutSenderUsuarioInput[]
    upsert?: MensajeUpsertWithWhereUniqueWithoutSenderUsuarioInput | MensajeUpsertWithWhereUniqueWithoutSenderUsuarioInput[]
    createMany?: MensajeCreateManySenderUsuarioInputEnvelope
    set?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    disconnect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    delete?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    update?: MensajeUpdateWithWhereUniqueWithoutSenderUsuarioInput | MensajeUpdateWithWhereUniqueWithoutSenderUsuarioInput[]
    updateMany?: MensajeUpdateManyWithWhereWithoutSenderUsuarioInput | MensajeUpdateManyWithWhereWithoutSenderUsuarioInput[]
    deleteMany?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
  }

  export type MensajeUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<MensajeCreateWithoutReceiverInput, MensajeUncheckedCreateWithoutReceiverInput> | MensajeCreateWithoutReceiverInput[] | MensajeUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutReceiverInput | MensajeCreateOrConnectWithoutReceiverInput[]
    upsert?: MensajeUpsertWithWhereUniqueWithoutReceiverInput | MensajeUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: MensajeCreateManyReceiverInputEnvelope
    set?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    disconnect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    delete?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    update?: MensajeUpdateWithWhereUniqueWithoutReceiverInput | MensajeUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: MensajeUpdateManyWithWhereWithoutReceiverInput | MensajeUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
  }

  export type NotificacionUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<NotificacionCreateWithoutUsuarioInput, NotificacionUncheckedCreateWithoutUsuarioInput> | NotificacionCreateWithoutUsuarioInput[] | NotificacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: NotificacionCreateOrConnectWithoutUsuarioInput | NotificacionCreateOrConnectWithoutUsuarioInput[]
    upsert?: NotificacionUpsertWithWhereUniqueWithoutUsuarioInput | NotificacionUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: NotificacionCreateManyUsuarioInputEnvelope
    set?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    disconnect?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    delete?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    connect?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    update?: NotificacionUpdateWithWhereUniqueWithoutUsuarioInput | NotificacionUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: NotificacionUpdateManyWithWhereWithoutUsuarioInput | NotificacionUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: NotificacionScalarWhereInput | NotificacionScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PostulacionUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<PostulacionCreateWithoutUsuarioInput, PostulacionUncheckedCreateWithoutUsuarioInput> | PostulacionCreateWithoutUsuarioInput[] | PostulacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutUsuarioInput | PostulacionCreateOrConnectWithoutUsuarioInput[]
    upsert?: PostulacionUpsertWithWhereUniqueWithoutUsuarioInput | PostulacionUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: PostulacionCreateManyUsuarioInputEnvelope
    set?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    disconnect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    delete?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    update?: PostulacionUpdateWithWhereUniqueWithoutUsuarioInput | PostulacionUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: PostulacionUpdateManyWithWhereWithoutUsuarioInput | PostulacionUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: PostulacionScalarWhereInput | PostulacionScalarWhereInput[]
  }

  export type MensajeUncheckedUpdateManyWithoutSenderUsuarioNestedInput = {
    create?: XOR<MensajeCreateWithoutSenderUsuarioInput, MensajeUncheckedCreateWithoutSenderUsuarioInput> | MensajeCreateWithoutSenderUsuarioInput[] | MensajeUncheckedCreateWithoutSenderUsuarioInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderUsuarioInput | MensajeCreateOrConnectWithoutSenderUsuarioInput[]
    upsert?: MensajeUpsertWithWhereUniqueWithoutSenderUsuarioInput | MensajeUpsertWithWhereUniqueWithoutSenderUsuarioInput[]
    createMany?: MensajeCreateManySenderUsuarioInputEnvelope
    set?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    disconnect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    delete?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    update?: MensajeUpdateWithWhereUniqueWithoutSenderUsuarioInput | MensajeUpdateWithWhereUniqueWithoutSenderUsuarioInput[]
    updateMany?: MensajeUpdateManyWithWhereWithoutSenderUsuarioInput | MensajeUpdateManyWithWhereWithoutSenderUsuarioInput[]
    deleteMany?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
  }

  export type MensajeUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<MensajeCreateWithoutReceiverInput, MensajeUncheckedCreateWithoutReceiverInput> | MensajeCreateWithoutReceiverInput[] | MensajeUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutReceiverInput | MensajeCreateOrConnectWithoutReceiverInput[]
    upsert?: MensajeUpsertWithWhereUniqueWithoutReceiverInput | MensajeUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: MensajeCreateManyReceiverInputEnvelope
    set?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    disconnect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    delete?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    update?: MensajeUpdateWithWhereUniqueWithoutReceiverInput | MensajeUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: MensajeUpdateManyWithWhereWithoutReceiverInput | MensajeUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
  }

  export type NotificacionUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<NotificacionCreateWithoutUsuarioInput, NotificacionUncheckedCreateWithoutUsuarioInput> | NotificacionCreateWithoutUsuarioInput[] | NotificacionUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: NotificacionCreateOrConnectWithoutUsuarioInput | NotificacionCreateOrConnectWithoutUsuarioInput[]
    upsert?: NotificacionUpsertWithWhereUniqueWithoutUsuarioInput | NotificacionUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: NotificacionCreateManyUsuarioInputEnvelope
    set?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    disconnect?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    delete?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    connect?: NotificacionWhereUniqueInput | NotificacionWhereUniqueInput[]
    update?: NotificacionUpdateWithWhereUniqueWithoutUsuarioInput | NotificacionUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: NotificacionUpdateManyWithWhereWithoutUsuarioInput | NotificacionUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: NotificacionScalarWhereInput | NotificacionScalarWhereInput[]
  }

  export type EmpresaCreateeconomicSectorInput = {
    set: string[]
  }

  export type EmpresaCreatedistributionChannelsInput = {
    set: string[]
  }

  export type VacanteCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<VacanteCreateWithoutEmpresaInput, VacanteUncheckedCreateWithoutEmpresaInput> | VacanteCreateWithoutEmpresaInput[] | VacanteUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: VacanteCreateOrConnectWithoutEmpresaInput | VacanteCreateOrConnectWithoutEmpresaInput[]
    createMany?: VacanteCreateManyEmpresaInputEnvelope
    connect?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
  }

  export type MensajeCreateNestedManyWithoutSenderEmpresaInput = {
    create?: XOR<MensajeCreateWithoutSenderEmpresaInput, MensajeUncheckedCreateWithoutSenderEmpresaInput> | MensajeCreateWithoutSenderEmpresaInput[] | MensajeUncheckedCreateWithoutSenderEmpresaInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderEmpresaInput | MensajeCreateOrConnectWithoutSenderEmpresaInput[]
    createMany?: MensajeCreateManySenderEmpresaInputEnvelope
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
  }

  export type VacanteUncheckedCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<VacanteCreateWithoutEmpresaInput, VacanteUncheckedCreateWithoutEmpresaInput> | VacanteCreateWithoutEmpresaInput[] | VacanteUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: VacanteCreateOrConnectWithoutEmpresaInput | VacanteCreateOrConnectWithoutEmpresaInput[]
    createMany?: VacanteCreateManyEmpresaInputEnvelope
    connect?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
  }

  export type MensajeUncheckedCreateNestedManyWithoutSenderEmpresaInput = {
    create?: XOR<MensajeCreateWithoutSenderEmpresaInput, MensajeUncheckedCreateWithoutSenderEmpresaInput> | MensajeCreateWithoutSenderEmpresaInput[] | MensajeUncheckedCreateWithoutSenderEmpresaInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderEmpresaInput | MensajeCreateOrConnectWithoutSenderEmpresaInput[]
    createMany?: MensajeCreateManySenderEmpresaInputEnvelope
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
  }

  export type EmpresaUpdateeconomicSectorInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EmpresaUpdatedistributionChannelsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type VacanteUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<VacanteCreateWithoutEmpresaInput, VacanteUncheckedCreateWithoutEmpresaInput> | VacanteCreateWithoutEmpresaInput[] | VacanteUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: VacanteCreateOrConnectWithoutEmpresaInput | VacanteCreateOrConnectWithoutEmpresaInput[]
    upsert?: VacanteUpsertWithWhereUniqueWithoutEmpresaInput | VacanteUpsertWithWhereUniqueWithoutEmpresaInput[]
    createMany?: VacanteCreateManyEmpresaInputEnvelope
    set?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    disconnect?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    delete?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    connect?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    update?: VacanteUpdateWithWhereUniqueWithoutEmpresaInput | VacanteUpdateWithWhereUniqueWithoutEmpresaInput[]
    updateMany?: VacanteUpdateManyWithWhereWithoutEmpresaInput | VacanteUpdateManyWithWhereWithoutEmpresaInput[]
    deleteMany?: VacanteScalarWhereInput | VacanteScalarWhereInput[]
  }

  export type MensajeUpdateManyWithoutSenderEmpresaNestedInput = {
    create?: XOR<MensajeCreateWithoutSenderEmpresaInput, MensajeUncheckedCreateWithoutSenderEmpresaInput> | MensajeCreateWithoutSenderEmpresaInput[] | MensajeUncheckedCreateWithoutSenderEmpresaInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderEmpresaInput | MensajeCreateOrConnectWithoutSenderEmpresaInput[]
    upsert?: MensajeUpsertWithWhereUniqueWithoutSenderEmpresaInput | MensajeUpsertWithWhereUniqueWithoutSenderEmpresaInput[]
    createMany?: MensajeCreateManySenderEmpresaInputEnvelope
    set?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    disconnect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    delete?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    update?: MensajeUpdateWithWhereUniqueWithoutSenderEmpresaInput | MensajeUpdateWithWhereUniqueWithoutSenderEmpresaInput[]
    updateMany?: MensajeUpdateManyWithWhereWithoutSenderEmpresaInput | MensajeUpdateManyWithWhereWithoutSenderEmpresaInput[]
    deleteMany?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
  }

  export type VacanteUncheckedUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<VacanteCreateWithoutEmpresaInput, VacanteUncheckedCreateWithoutEmpresaInput> | VacanteCreateWithoutEmpresaInput[] | VacanteUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: VacanteCreateOrConnectWithoutEmpresaInput | VacanteCreateOrConnectWithoutEmpresaInput[]
    upsert?: VacanteUpsertWithWhereUniqueWithoutEmpresaInput | VacanteUpsertWithWhereUniqueWithoutEmpresaInput[]
    createMany?: VacanteCreateManyEmpresaInputEnvelope
    set?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    disconnect?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    delete?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    connect?: VacanteWhereUniqueInput | VacanteWhereUniqueInput[]
    update?: VacanteUpdateWithWhereUniqueWithoutEmpresaInput | VacanteUpdateWithWhereUniqueWithoutEmpresaInput[]
    updateMany?: VacanteUpdateManyWithWhereWithoutEmpresaInput | VacanteUpdateManyWithWhereWithoutEmpresaInput[]
    deleteMany?: VacanteScalarWhereInput | VacanteScalarWhereInput[]
  }

  export type MensajeUncheckedUpdateManyWithoutSenderEmpresaNestedInput = {
    create?: XOR<MensajeCreateWithoutSenderEmpresaInput, MensajeUncheckedCreateWithoutSenderEmpresaInput> | MensajeCreateWithoutSenderEmpresaInput[] | MensajeUncheckedCreateWithoutSenderEmpresaInput[]
    connectOrCreate?: MensajeCreateOrConnectWithoutSenderEmpresaInput | MensajeCreateOrConnectWithoutSenderEmpresaInput[]
    upsert?: MensajeUpsertWithWhereUniqueWithoutSenderEmpresaInput | MensajeUpsertWithWhereUniqueWithoutSenderEmpresaInput[]
    createMany?: MensajeCreateManySenderEmpresaInputEnvelope
    set?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    disconnect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    delete?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    connect?: MensajeWhereUniqueInput | MensajeWhereUniqueInput[]
    update?: MensajeUpdateWithWhereUniqueWithoutSenderEmpresaInput | MensajeUpdateWithWhereUniqueWithoutSenderEmpresaInput[]
    updateMany?: MensajeUpdateManyWithWhereWithoutSenderEmpresaInput | MensajeUpdateManyWithWhereWithoutSenderEmpresaInput[]
    deleteMany?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
  }

  export type EmpresaCreateNestedOneWithoutVacantesInput = {
    create?: XOR<EmpresaCreateWithoutVacantesInput, EmpresaUncheckedCreateWithoutVacantesInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutVacantesInput
    connect?: EmpresaWhereUniqueInput
  }

  export type PostulacionCreateNestedManyWithoutVacanteInput = {
    create?: XOR<PostulacionCreateWithoutVacanteInput, PostulacionUncheckedCreateWithoutVacanteInput> | PostulacionCreateWithoutVacanteInput[] | PostulacionUncheckedCreateWithoutVacanteInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutVacanteInput | PostulacionCreateOrConnectWithoutVacanteInput[]
    createMany?: PostulacionCreateManyVacanteInputEnvelope
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
  }

  export type PostulacionUncheckedCreateNestedManyWithoutVacanteInput = {
    create?: XOR<PostulacionCreateWithoutVacanteInput, PostulacionUncheckedCreateWithoutVacanteInput> | PostulacionCreateWithoutVacanteInput[] | PostulacionUncheckedCreateWithoutVacanteInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutVacanteInput | PostulacionCreateOrConnectWithoutVacanteInput[]
    createMany?: PostulacionCreateManyVacanteInputEnvelope
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
  }

  export type EmpresaUpdateOneRequiredWithoutVacantesNestedInput = {
    create?: XOR<EmpresaCreateWithoutVacantesInput, EmpresaUncheckedCreateWithoutVacantesInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutVacantesInput
    upsert?: EmpresaUpsertWithoutVacantesInput
    connect?: EmpresaWhereUniqueInput
    update?: XOR<XOR<EmpresaUpdateToOneWithWhereWithoutVacantesInput, EmpresaUpdateWithoutVacantesInput>, EmpresaUncheckedUpdateWithoutVacantesInput>
  }

  export type PostulacionUpdateManyWithoutVacanteNestedInput = {
    create?: XOR<PostulacionCreateWithoutVacanteInput, PostulacionUncheckedCreateWithoutVacanteInput> | PostulacionCreateWithoutVacanteInput[] | PostulacionUncheckedCreateWithoutVacanteInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutVacanteInput | PostulacionCreateOrConnectWithoutVacanteInput[]
    upsert?: PostulacionUpsertWithWhereUniqueWithoutVacanteInput | PostulacionUpsertWithWhereUniqueWithoutVacanteInput[]
    createMany?: PostulacionCreateManyVacanteInputEnvelope
    set?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    disconnect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    delete?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    update?: PostulacionUpdateWithWhereUniqueWithoutVacanteInput | PostulacionUpdateWithWhereUniqueWithoutVacanteInput[]
    updateMany?: PostulacionUpdateManyWithWhereWithoutVacanteInput | PostulacionUpdateManyWithWhereWithoutVacanteInput[]
    deleteMany?: PostulacionScalarWhereInput | PostulacionScalarWhereInput[]
  }

  export type PostulacionUncheckedUpdateManyWithoutVacanteNestedInput = {
    create?: XOR<PostulacionCreateWithoutVacanteInput, PostulacionUncheckedCreateWithoutVacanteInput> | PostulacionCreateWithoutVacanteInput[] | PostulacionUncheckedCreateWithoutVacanteInput[]
    connectOrCreate?: PostulacionCreateOrConnectWithoutVacanteInput | PostulacionCreateOrConnectWithoutVacanteInput[]
    upsert?: PostulacionUpsertWithWhereUniqueWithoutVacanteInput | PostulacionUpsertWithWhereUniqueWithoutVacanteInput[]
    createMany?: PostulacionCreateManyVacanteInputEnvelope
    set?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    disconnect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    delete?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    connect?: PostulacionWhereUniqueInput | PostulacionWhereUniqueInput[]
    update?: PostulacionUpdateWithWhereUniqueWithoutVacanteInput | PostulacionUpdateWithWhereUniqueWithoutVacanteInput[]
    updateMany?: PostulacionUpdateManyWithWhereWithoutVacanteInput | PostulacionUpdateManyWithWhereWithoutVacanteInput[]
    deleteMany?: PostulacionScalarWhereInput | PostulacionScalarWhereInput[]
  }

  export type VacanteCreateNestedOneWithoutPostulacionesInput = {
    create?: XOR<VacanteCreateWithoutPostulacionesInput, VacanteUncheckedCreateWithoutPostulacionesInput>
    connectOrCreate?: VacanteCreateOrConnectWithoutPostulacionesInput
    connect?: VacanteWhereUniqueInput
  }

  export type UsuarioCreateNestedOneWithoutPostulacionesInput = {
    create?: XOR<UsuarioCreateWithoutPostulacionesInput, UsuarioUncheckedCreateWithoutPostulacionesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutPostulacionesInput
    connect?: UsuarioWhereUniqueInput
  }

  export type VacanteUpdateOneRequiredWithoutPostulacionesNestedInput = {
    create?: XOR<VacanteCreateWithoutPostulacionesInput, VacanteUncheckedCreateWithoutPostulacionesInput>
    connectOrCreate?: VacanteCreateOrConnectWithoutPostulacionesInput
    upsert?: VacanteUpsertWithoutPostulacionesInput
    connect?: VacanteWhereUniqueInput
    update?: XOR<XOR<VacanteUpdateToOneWithWhereWithoutPostulacionesInput, VacanteUpdateWithoutPostulacionesInput>, VacanteUncheckedUpdateWithoutPostulacionesInput>
  }

  export type UsuarioUpdateOneRequiredWithoutPostulacionesNestedInput = {
    create?: XOR<UsuarioCreateWithoutPostulacionesInput, UsuarioUncheckedCreateWithoutPostulacionesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutPostulacionesInput
    upsert?: UsuarioUpsertWithoutPostulacionesInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutPostulacionesInput, UsuarioUpdateWithoutPostulacionesInput>, UsuarioUncheckedUpdateWithoutPostulacionesInput>
  }

  export type EmpresaCreateNestedOneWithoutMensajesEnviadosInput = {
    create?: XOR<EmpresaCreateWithoutMensajesEnviadosInput, EmpresaUncheckedCreateWithoutMensajesEnviadosInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutMensajesEnviadosInput
    connect?: EmpresaWhereUniqueInput
  }

  export type UsuarioCreateNestedOneWithoutMensajesEnviadosInput = {
    create?: XOR<UsuarioCreateWithoutMensajesEnviadosInput, UsuarioUncheckedCreateWithoutMensajesEnviadosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutMensajesEnviadosInput
    connect?: UsuarioWhereUniqueInput
  }

  export type UsuarioCreateNestedOneWithoutMensajesRecibidosInput = {
    create?: XOR<UsuarioCreateWithoutMensajesRecibidosInput, UsuarioUncheckedCreateWithoutMensajesRecibidosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutMensajesRecibidosInput
    connect?: UsuarioWhereUniqueInput
  }

  export type NotificacionCreateNestedOneWithoutMensajeInput = {
    create?: XOR<NotificacionCreateWithoutMensajeInput, NotificacionUncheckedCreateWithoutMensajeInput>
    connectOrCreate?: NotificacionCreateOrConnectWithoutMensajeInput
    connect?: NotificacionWhereUniqueInput
  }

  export type NotificacionUncheckedCreateNestedOneWithoutMensajeInput = {
    create?: XOR<NotificacionCreateWithoutMensajeInput, NotificacionUncheckedCreateWithoutMensajeInput>
    connectOrCreate?: NotificacionCreateOrConnectWithoutMensajeInput
    connect?: NotificacionWhereUniqueInput
  }

  export type EmpresaUpdateOneWithoutMensajesEnviadosNestedInput = {
    create?: XOR<EmpresaCreateWithoutMensajesEnviadosInput, EmpresaUncheckedCreateWithoutMensajesEnviadosInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutMensajesEnviadosInput
    upsert?: EmpresaUpsertWithoutMensajesEnviadosInput
    disconnect?: EmpresaWhereInput | boolean
    delete?: EmpresaWhereInput | boolean
    connect?: EmpresaWhereUniqueInput
    update?: XOR<XOR<EmpresaUpdateToOneWithWhereWithoutMensajesEnviadosInput, EmpresaUpdateWithoutMensajesEnviadosInput>, EmpresaUncheckedUpdateWithoutMensajesEnviadosInput>
  }

  export type UsuarioUpdateOneWithoutMensajesEnviadosNestedInput = {
    create?: XOR<UsuarioCreateWithoutMensajesEnviadosInput, UsuarioUncheckedCreateWithoutMensajesEnviadosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutMensajesEnviadosInput
    upsert?: UsuarioUpsertWithoutMensajesEnviadosInput
    disconnect?: UsuarioWhereInput | boolean
    delete?: UsuarioWhereInput | boolean
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutMensajesEnviadosInput, UsuarioUpdateWithoutMensajesEnviadosInput>, UsuarioUncheckedUpdateWithoutMensajesEnviadosInput>
  }

  export type UsuarioUpdateOneRequiredWithoutMensajesRecibidosNestedInput = {
    create?: XOR<UsuarioCreateWithoutMensajesRecibidosInput, UsuarioUncheckedCreateWithoutMensajesRecibidosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutMensajesRecibidosInput
    upsert?: UsuarioUpsertWithoutMensajesRecibidosInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutMensajesRecibidosInput, UsuarioUpdateWithoutMensajesRecibidosInput>, UsuarioUncheckedUpdateWithoutMensajesRecibidosInput>
  }

  export type NotificacionUpdateOneWithoutMensajeNestedInput = {
    create?: XOR<NotificacionCreateWithoutMensajeInput, NotificacionUncheckedCreateWithoutMensajeInput>
    connectOrCreate?: NotificacionCreateOrConnectWithoutMensajeInput
    upsert?: NotificacionUpsertWithoutMensajeInput
    disconnect?: NotificacionWhereInput | boolean
    delete?: NotificacionWhereInput | boolean
    connect?: NotificacionWhereUniqueInput
    update?: XOR<XOR<NotificacionUpdateToOneWithWhereWithoutMensajeInput, NotificacionUpdateWithoutMensajeInput>, NotificacionUncheckedUpdateWithoutMensajeInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NotificacionUncheckedUpdateOneWithoutMensajeNestedInput = {
    create?: XOR<NotificacionCreateWithoutMensajeInput, NotificacionUncheckedCreateWithoutMensajeInput>
    connectOrCreate?: NotificacionCreateOrConnectWithoutMensajeInput
    upsert?: NotificacionUpsertWithoutMensajeInput
    disconnect?: NotificacionWhereInput | boolean
    delete?: NotificacionWhereInput | boolean
    connect?: NotificacionWhereUniqueInput
    update?: XOR<XOR<NotificacionUpdateToOneWithWhereWithoutMensajeInput, NotificacionUpdateWithoutMensajeInput>, NotificacionUncheckedUpdateWithoutMensajeInput>
  }

  export type MensajeCreateNestedOneWithoutNotificacionInput = {
    create?: XOR<MensajeCreateWithoutNotificacionInput, MensajeUncheckedCreateWithoutNotificacionInput>
    connectOrCreate?: MensajeCreateOrConnectWithoutNotificacionInput
    connect?: MensajeWhereUniqueInput
  }

  export type UsuarioCreateNestedOneWithoutNotificacionesInput = {
    create?: XOR<UsuarioCreateWithoutNotificacionesInput, UsuarioUncheckedCreateWithoutNotificacionesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutNotificacionesInput
    connect?: UsuarioWhereUniqueInput
  }

  export type MensajeUpdateOneWithoutNotificacionNestedInput = {
    create?: XOR<MensajeCreateWithoutNotificacionInput, MensajeUncheckedCreateWithoutNotificacionInput>
    connectOrCreate?: MensajeCreateOrConnectWithoutNotificacionInput
    upsert?: MensajeUpsertWithoutNotificacionInput
    disconnect?: MensajeWhereInput | boolean
    delete?: MensajeWhereInput | boolean
    connect?: MensajeWhereUniqueInput
    update?: XOR<XOR<MensajeUpdateToOneWithWhereWithoutNotificacionInput, MensajeUpdateWithoutNotificacionInput>, MensajeUncheckedUpdateWithoutNotificacionInput>
  }

  export type UsuarioUpdateOneRequiredWithoutNotificacionesNestedInput = {
    create?: XOR<UsuarioCreateWithoutNotificacionesInput, UsuarioUncheckedCreateWithoutNotificacionesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutNotificacionesInput
    upsert?: UsuarioUpsertWithoutNotificacionesInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutNotificacionesInput, UsuarioUpdateWithoutNotificacionesInput>, UsuarioUncheckedUpdateWithoutNotificacionesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type PostulacionCreateWithoutUsuarioInput = {
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    vacante: VacanteCreateNestedOneWithoutPostulacionesInput
  }

  export type PostulacionUncheckedCreateWithoutUsuarioInput = {
    id?: number
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    vacanteId: number
  }

  export type PostulacionCreateOrConnectWithoutUsuarioInput = {
    where: PostulacionWhereUniqueInput
    create: XOR<PostulacionCreateWithoutUsuarioInput, PostulacionUncheckedCreateWithoutUsuarioInput>
  }

  export type PostulacionCreateManyUsuarioInputEnvelope = {
    data: PostulacionCreateManyUsuarioInput | PostulacionCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type MensajeCreateWithoutSenderUsuarioInput = {
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresa?: EmpresaCreateNestedOneWithoutMensajesEnviadosInput
    receiver: UsuarioCreateNestedOneWithoutMensajesRecibidosInput
    notificacion?: NotificacionCreateNestedOneWithoutMensajeInput
  }

  export type MensajeUncheckedCreateWithoutSenderUsuarioInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresaId?: number | null
    receiverId: number
    notificacion?: NotificacionUncheckedCreateNestedOneWithoutMensajeInput
  }

  export type MensajeCreateOrConnectWithoutSenderUsuarioInput = {
    where: MensajeWhereUniqueInput
    create: XOR<MensajeCreateWithoutSenderUsuarioInput, MensajeUncheckedCreateWithoutSenderUsuarioInput>
  }

  export type MensajeCreateManySenderUsuarioInputEnvelope = {
    data: MensajeCreateManySenderUsuarioInput | MensajeCreateManySenderUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type MensajeCreateWithoutReceiverInput = {
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresa?: EmpresaCreateNestedOneWithoutMensajesEnviadosInput
    senderUsuario?: UsuarioCreateNestedOneWithoutMensajesEnviadosInput
    notificacion?: NotificacionCreateNestedOneWithoutMensajeInput
  }

  export type MensajeUncheckedCreateWithoutReceiverInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresaId?: number | null
    senderUsuarioId?: number | null
    notificacion?: NotificacionUncheckedCreateNestedOneWithoutMensajeInput
  }

  export type MensajeCreateOrConnectWithoutReceiverInput = {
    where: MensajeWhereUniqueInput
    create: XOR<MensajeCreateWithoutReceiverInput, MensajeUncheckedCreateWithoutReceiverInput>
  }

  export type MensajeCreateManyReceiverInputEnvelope = {
    data: MensajeCreateManyReceiverInput | MensajeCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type NotificacionCreateWithoutUsuarioInput = {
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    mensaje?: MensajeCreateNestedOneWithoutNotificacionInput
  }

  export type NotificacionUncheckedCreateWithoutUsuarioInput = {
    id?: number
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    mensajeId?: number | null
  }

  export type NotificacionCreateOrConnectWithoutUsuarioInput = {
    where: NotificacionWhereUniqueInput
    create: XOR<NotificacionCreateWithoutUsuarioInput, NotificacionUncheckedCreateWithoutUsuarioInput>
  }

  export type NotificacionCreateManyUsuarioInputEnvelope = {
    data: NotificacionCreateManyUsuarioInput | NotificacionCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type PostulacionUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: PostulacionWhereUniqueInput
    update: XOR<PostulacionUpdateWithoutUsuarioInput, PostulacionUncheckedUpdateWithoutUsuarioInput>
    create: XOR<PostulacionCreateWithoutUsuarioInput, PostulacionUncheckedCreateWithoutUsuarioInput>
  }

  export type PostulacionUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: PostulacionWhereUniqueInput
    data: XOR<PostulacionUpdateWithoutUsuarioInput, PostulacionUncheckedUpdateWithoutUsuarioInput>
  }

  export type PostulacionUpdateManyWithWhereWithoutUsuarioInput = {
    where: PostulacionScalarWhereInput
    data: XOR<PostulacionUpdateManyMutationInput, PostulacionUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type PostulacionScalarWhereInput = {
    AND?: PostulacionScalarWhereInput | PostulacionScalarWhereInput[]
    OR?: PostulacionScalarWhereInput[]
    NOT?: PostulacionScalarWhereInput | PostulacionScalarWhereInput[]
    id?: IntFilter<"Postulacion"> | number
    telefono?: StringNullableFilter<"Postulacion"> | string | null
    cv_url?: StringNullableFilter<"Postulacion"> | string | null
    estado?: StringFilter<"Postulacion"> | string
    fecha?: DateTimeFilter<"Postulacion"> | Date | string
    vacanteId?: IntFilter<"Postulacion"> | number
    usuarioId?: IntFilter<"Postulacion"> | number
  }

  export type MensajeUpsertWithWhereUniqueWithoutSenderUsuarioInput = {
    where: MensajeWhereUniqueInput
    update: XOR<MensajeUpdateWithoutSenderUsuarioInput, MensajeUncheckedUpdateWithoutSenderUsuarioInput>
    create: XOR<MensajeCreateWithoutSenderUsuarioInput, MensajeUncheckedCreateWithoutSenderUsuarioInput>
  }

  export type MensajeUpdateWithWhereUniqueWithoutSenderUsuarioInput = {
    where: MensajeWhereUniqueInput
    data: XOR<MensajeUpdateWithoutSenderUsuarioInput, MensajeUncheckedUpdateWithoutSenderUsuarioInput>
  }

  export type MensajeUpdateManyWithWhereWithoutSenderUsuarioInput = {
    where: MensajeScalarWhereInput
    data: XOR<MensajeUpdateManyMutationInput, MensajeUncheckedUpdateManyWithoutSenderUsuarioInput>
  }

  export type MensajeScalarWhereInput = {
    AND?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
    OR?: MensajeScalarWhereInput[]
    NOT?: MensajeScalarWhereInput | MensajeScalarWhereInput[]
    id?: IntFilter<"Mensaje"> | number
    contenido?: StringFilter<"Mensaje"> | string
    fechaEnvio?: DateTimeFilter<"Mensaje"> | Date | string
    read?: BoolFilter<"Mensaje"> | boolean
    senderType?: StringFilter<"Mensaje"> | string
    senderEmpresaId?: IntNullableFilter<"Mensaje"> | number | null
    senderUsuarioId?: IntNullableFilter<"Mensaje"> | number | null
    receiverId?: IntFilter<"Mensaje"> | number
  }

  export type MensajeUpsertWithWhereUniqueWithoutReceiverInput = {
    where: MensajeWhereUniqueInput
    update: XOR<MensajeUpdateWithoutReceiverInput, MensajeUncheckedUpdateWithoutReceiverInput>
    create: XOR<MensajeCreateWithoutReceiverInput, MensajeUncheckedCreateWithoutReceiverInput>
  }

  export type MensajeUpdateWithWhereUniqueWithoutReceiverInput = {
    where: MensajeWhereUniqueInput
    data: XOR<MensajeUpdateWithoutReceiverInput, MensajeUncheckedUpdateWithoutReceiverInput>
  }

  export type MensajeUpdateManyWithWhereWithoutReceiverInput = {
    where: MensajeScalarWhereInput
    data: XOR<MensajeUpdateManyMutationInput, MensajeUncheckedUpdateManyWithoutReceiverInput>
  }

  export type NotificacionUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: NotificacionWhereUniqueInput
    update: XOR<NotificacionUpdateWithoutUsuarioInput, NotificacionUncheckedUpdateWithoutUsuarioInput>
    create: XOR<NotificacionCreateWithoutUsuarioInput, NotificacionUncheckedCreateWithoutUsuarioInput>
  }

  export type NotificacionUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: NotificacionWhereUniqueInput
    data: XOR<NotificacionUpdateWithoutUsuarioInput, NotificacionUncheckedUpdateWithoutUsuarioInput>
  }

  export type NotificacionUpdateManyWithWhereWithoutUsuarioInput = {
    where: NotificacionScalarWhereInput
    data: XOR<NotificacionUpdateManyMutationInput, NotificacionUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type NotificacionScalarWhereInput = {
    AND?: NotificacionScalarWhereInput | NotificacionScalarWhereInput[]
    OR?: NotificacionScalarWhereInput[]
    NOT?: NotificacionScalarWhereInput | NotificacionScalarWhereInput[]
    id?: IntFilter<"Notificacion"> | number
    tipo?: StringFilter<"Notificacion"> | string
    contenido?: StringFilter<"Notificacion"> | string
    fecha?: DateTimeFilter<"Notificacion"> | Date | string
    vista?: BoolFilter<"Notificacion"> | boolean
    referenciaId?: IntNullableFilter<"Notificacion"> | number | null
    mensajeId?: IntNullableFilter<"Notificacion"> | number | null
    usuarioId?: IntFilter<"Notificacion"> | number
  }

  export type VacanteCreateWithoutEmpresaInput = {
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
    postulaciones?: PostulacionCreateNestedManyWithoutVacanteInput
  }

  export type VacanteUncheckedCreateWithoutEmpresaInput = {
    id?: number
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
    postulaciones?: PostulacionUncheckedCreateNestedManyWithoutVacanteInput
  }

  export type VacanteCreateOrConnectWithoutEmpresaInput = {
    where: VacanteWhereUniqueInput
    create: XOR<VacanteCreateWithoutEmpresaInput, VacanteUncheckedCreateWithoutEmpresaInput>
  }

  export type VacanteCreateManyEmpresaInputEnvelope = {
    data: VacanteCreateManyEmpresaInput | VacanteCreateManyEmpresaInput[]
    skipDuplicates?: boolean
  }

  export type MensajeCreateWithoutSenderEmpresaInput = {
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderUsuario?: UsuarioCreateNestedOneWithoutMensajesEnviadosInput
    receiver: UsuarioCreateNestedOneWithoutMensajesRecibidosInput
    notificacion?: NotificacionCreateNestedOneWithoutMensajeInput
  }

  export type MensajeUncheckedCreateWithoutSenderEmpresaInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderUsuarioId?: number | null
    receiverId: number
    notificacion?: NotificacionUncheckedCreateNestedOneWithoutMensajeInput
  }

  export type MensajeCreateOrConnectWithoutSenderEmpresaInput = {
    where: MensajeWhereUniqueInput
    create: XOR<MensajeCreateWithoutSenderEmpresaInput, MensajeUncheckedCreateWithoutSenderEmpresaInput>
  }

  export type MensajeCreateManySenderEmpresaInputEnvelope = {
    data: MensajeCreateManySenderEmpresaInput | MensajeCreateManySenderEmpresaInput[]
    skipDuplicates?: boolean
  }

  export type VacanteUpsertWithWhereUniqueWithoutEmpresaInput = {
    where: VacanteWhereUniqueInput
    update: XOR<VacanteUpdateWithoutEmpresaInput, VacanteUncheckedUpdateWithoutEmpresaInput>
    create: XOR<VacanteCreateWithoutEmpresaInput, VacanteUncheckedCreateWithoutEmpresaInput>
  }

  export type VacanteUpdateWithWhereUniqueWithoutEmpresaInput = {
    where: VacanteWhereUniqueInput
    data: XOR<VacanteUpdateWithoutEmpresaInput, VacanteUncheckedUpdateWithoutEmpresaInput>
  }

  export type VacanteUpdateManyWithWhereWithoutEmpresaInput = {
    where: VacanteScalarWhereInput
    data: XOR<VacanteUpdateManyMutationInput, VacanteUncheckedUpdateManyWithoutEmpresaInput>
  }

  export type VacanteScalarWhereInput = {
    AND?: VacanteScalarWhereInput | VacanteScalarWhereInput[]
    OR?: VacanteScalarWhereInput[]
    NOT?: VacanteScalarWhereInput | VacanteScalarWhereInput[]
    id?: IntFilter<"Vacante"> | number
    titulo?: StringFilter<"Vacante"> | string
    descripcion?: StringFilter<"Vacante"> | string
    ubicacion?: StringFilter<"Vacante"> | string
    tipo?: StringFilter<"Vacante"> | string
    modalidad?: StringFilter<"Vacante"> | string
    salario?: StringNullableFilter<"Vacante"> | string | null
    fechaCreacion?: DateTimeFilter<"Vacante"> | Date | string
    empresaId?: IntFilter<"Vacante"> | number
  }

  export type MensajeUpsertWithWhereUniqueWithoutSenderEmpresaInput = {
    where: MensajeWhereUniqueInput
    update: XOR<MensajeUpdateWithoutSenderEmpresaInput, MensajeUncheckedUpdateWithoutSenderEmpresaInput>
    create: XOR<MensajeCreateWithoutSenderEmpresaInput, MensajeUncheckedCreateWithoutSenderEmpresaInput>
  }

  export type MensajeUpdateWithWhereUniqueWithoutSenderEmpresaInput = {
    where: MensajeWhereUniqueInput
    data: XOR<MensajeUpdateWithoutSenderEmpresaInput, MensajeUncheckedUpdateWithoutSenderEmpresaInput>
  }

  export type MensajeUpdateManyWithWhereWithoutSenderEmpresaInput = {
    where: MensajeScalarWhereInput
    data: XOR<MensajeUpdateManyMutationInput, MensajeUncheckedUpdateManyWithoutSenderEmpresaInput>
  }

  export type EmpresaCreateWithoutVacantesInput = {
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit?: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector?: EmpresaCreateeconomicSectorInput | string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets?: string | null
    equity?: string | null
    distributionChannels?: EmpresaCreatedistributionChannelsInput | string[]
    mainClients: string
    emailAuthorization?: boolean
    createdAt?: Date | string
    mensajesEnviados?: MensajeCreateNestedManyWithoutSenderEmpresaInput
  }

  export type EmpresaUncheckedCreateWithoutVacantesInput = {
    id?: number
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit?: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector?: EmpresaCreateeconomicSectorInput | string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets?: string | null
    equity?: string | null
    distributionChannels?: EmpresaCreatedistributionChannelsInput | string[]
    mainClients: string
    emailAuthorization?: boolean
    createdAt?: Date | string
    mensajesEnviados?: MensajeUncheckedCreateNestedManyWithoutSenderEmpresaInput
  }

  export type EmpresaCreateOrConnectWithoutVacantesInput = {
    where: EmpresaWhereUniqueInput
    create: XOR<EmpresaCreateWithoutVacantesInput, EmpresaUncheckedCreateWithoutVacantesInput>
  }

  export type PostulacionCreateWithoutVacanteInput = {
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    usuario: UsuarioCreateNestedOneWithoutPostulacionesInput
  }

  export type PostulacionUncheckedCreateWithoutVacanteInput = {
    id?: number
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    usuarioId: number
  }

  export type PostulacionCreateOrConnectWithoutVacanteInput = {
    where: PostulacionWhereUniqueInput
    create: XOR<PostulacionCreateWithoutVacanteInput, PostulacionUncheckedCreateWithoutVacanteInput>
  }

  export type PostulacionCreateManyVacanteInputEnvelope = {
    data: PostulacionCreateManyVacanteInput | PostulacionCreateManyVacanteInput[]
    skipDuplicates?: boolean
  }

  export type EmpresaUpsertWithoutVacantesInput = {
    update: XOR<EmpresaUpdateWithoutVacantesInput, EmpresaUncheckedUpdateWithoutVacantesInput>
    create: XOR<EmpresaCreateWithoutVacantesInput, EmpresaUncheckedCreateWithoutVacantesInput>
    where?: EmpresaWhereInput
  }

  export type EmpresaUpdateToOneWithWhereWithoutVacantesInput = {
    where?: EmpresaWhereInput
    data: XOR<EmpresaUpdateWithoutVacantesInput, EmpresaUncheckedUpdateWithoutVacantesInput>
  }

  export type EmpresaUpdateWithoutVacantesInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mensajesEnviados?: MensajeUpdateManyWithoutSenderEmpresaNestedInput
  }

  export type EmpresaUncheckedUpdateWithoutVacantesInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mensajesEnviados?: MensajeUncheckedUpdateManyWithoutSenderEmpresaNestedInput
  }

  export type PostulacionUpsertWithWhereUniqueWithoutVacanteInput = {
    where: PostulacionWhereUniqueInput
    update: XOR<PostulacionUpdateWithoutVacanteInput, PostulacionUncheckedUpdateWithoutVacanteInput>
    create: XOR<PostulacionCreateWithoutVacanteInput, PostulacionUncheckedCreateWithoutVacanteInput>
  }

  export type PostulacionUpdateWithWhereUniqueWithoutVacanteInput = {
    where: PostulacionWhereUniqueInput
    data: XOR<PostulacionUpdateWithoutVacanteInput, PostulacionUncheckedUpdateWithoutVacanteInput>
  }

  export type PostulacionUpdateManyWithWhereWithoutVacanteInput = {
    where: PostulacionScalarWhereInput
    data: XOR<PostulacionUpdateManyMutationInput, PostulacionUncheckedUpdateManyWithoutVacanteInput>
  }

  export type VacanteCreateWithoutPostulacionesInput = {
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
    empresa: EmpresaCreateNestedOneWithoutVacantesInput
  }

  export type VacanteUncheckedCreateWithoutPostulacionesInput = {
    id?: number
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
    empresaId: number
  }

  export type VacanteCreateOrConnectWithoutPostulacionesInput = {
    where: VacanteWhereUniqueInput
    create: XOR<VacanteCreateWithoutPostulacionesInput, VacanteUncheckedCreateWithoutPostulacionesInput>
  }

  export type UsuarioCreateWithoutPostulacionesInput = {
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    mensajesEnviados?: MensajeCreateNestedManyWithoutSenderUsuarioInput
    mensajesRecibidos?: MensajeCreateNestedManyWithoutReceiverInput
    notificaciones?: NotificacionCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutPostulacionesInput = {
    id?: number
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    mensajesEnviados?: MensajeUncheckedCreateNestedManyWithoutSenderUsuarioInput
    mensajesRecibidos?: MensajeUncheckedCreateNestedManyWithoutReceiverInput
    notificaciones?: NotificacionUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutPostulacionesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutPostulacionesInput, UsuarioUncheckedCreateWithoutPostulacionesInput>
  }

  export type VacanteUpsertWithoutPostulacionesInput = {
    update: XOR<VacanteUpdateWithoutPostulacionesInput, VacanteUncheckedUpdateWithoutPostulacionesInput>
    create: XOR<VacanteCreateWithoutPostulacionesInput, VacanteUncheckedCreateWithoutPostulacionesInput>
    where?: VacanteWhereInput
  }

  export type VacanteUpdateToOneWithWhereWithoutPostulacionesInput = {
    where?: VacanteWhereInput
    data: XOR<VacanteUpdateWithoutPostulacionesInput, VacanteUncheckedUpdateWithoutPostulacionesInput>
  }

  export type VacanteUpdateWithoutPostulacionesInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    empresa?: EmpresaUpdateOneRequiredWithoutVacantesNestedInput
  }

  export type VacanteUncheckedUpdateWithoutPostulacionesInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    empresaId?: IntFieldUpdateOperationsInput | number
  }

  export type UsuarioUpsertWithoutPostulacionesInput = {
    update: XOR<UsuarioUpdateWithoutPostulacionesInput, UsuarioUncheckedUpdateWithoutPostulacionesInput>
    create: XOR<UsuarioCreateWithoutPostulacionesInput, UsuarioUncheckedCreateWithoutPostulacionesInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutPostulacionesInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutPostulacionesInput, UsuarioUncheckedUpdateWithoutPostulacionesInput>
  }

  export type UsuarioUpdateWithoutPostulacionesInput = {
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    mensajesEnviados?: MensajeUpdateManyWithoutSenderUsuarioNestedInput
    mensajesRecibidos?: MensajeUpdateManyWithoutReceiverNestedInput
    notificaciones?: NotificacionUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutPostulacionesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    mensajesEnviados?: MensajeUncheckedUpdateManyWithoutSenderUsuarioNestedInput
    mensajesRecibidos?: MensajeUncheckedUpdateManyWithoutReceiverNestedInput
    notificaciones?: NotificacionUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type EmpresaCreateWithoutMensajesEnviadosInput = {
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit?: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector?: EmpresaCreateeconomicSectorInput | string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets?: string | null
    equity?: string | null
    distributionChannels?: EmpresaCreatedistributionChannelsInput | string[]
    mainClients: string
    emailAuthorization?: boolean
    createdAt?: Date | string
    vacantes?: VacanteCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaUncheckedCreateWithoutMensajesEnviadosInput = {
    id?: number
    email: string
    password: string
    nombre: string
    phones: string
    contactName: string
    nit?: string | null
    address: string
    city: string
    department: string
    companyType: string
    economicSector?: EmpresaCreateeconomicSectorInput | string[]
    foundationYear: number
    employees: string
    annualRevenue: string
    totalAssets?: string | null
    equity?: string | null
    distributionChannels?: EmpresaCreatedistributionChannelsInput | string[]
    mainClients: string
    emailAuthorization?: boolean
    createdAt?: Date | string
    vacantes?: VacanteUncheckedCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaCreateOrConnectWithoutMensajesEnviadosInput = {
    where: EmpresaWhereUniqueInput
    create: XOR<EmpresaCreateWithoutMensajesEnviadosInput, EmpresaUncheckedCreateWithoutMensajesEnviadosInput>
  }

  export type UsuarioCreateWithoutMensajesEnviadosInput = {
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionCreateNestedManyWithoutUsuarioInput
    mensajesRecibidos?: MensajeCreateNestedManyWithoutReceiverInput
    notificaciones?: NotificacionCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutMensajesEnviadosInput = {
    id?: number
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionUncheckedCreateNestedManyWithoutUsuarioInput
    mensajesRecibidos?: MensajeUncheckedCreateNestedManyWithoutReceiverInput
    notificaciones?: NotificacionUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutMensajesEnviadosInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutMensajesEnviadosInput, UsuarioUncheckedCreateWithoutMensajesEnviadosInput>
  }

  export type UsuarioCreateWithoutMensajesRecibidosInput = {
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionCreateNestedManyWithoutUsuarioInput
    mensajesEnviados?: MensajeCreateNestedManyWithoutSenderUsuarioInput
    notificaciones?: NotificacionCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutMensajesRecibidosInput = {
    id?: number
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionUncheckedCreateNestedManyWithoutUsuarioInput
    mensajesEnviados?: MensajeUncheckedCreateNestedManyWithoutSenderUsuarioInput
    notificaciones?: NotificacionUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutMensajesRecibidosInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutMensajesRecibidosInput, UsuarioUncheckedCreateWithoutMensajesRecibidosInput>
  }

  export type NotificacionCreateWithoutMensajeInput = {
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    usuario: UsuarioCreateNestedOneWithoutNotificacionesInput
  }

  export type NotificacionUncheckedCreateWithoutMensajeInput = {
    id?: number
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    usuarioId: number
  }

  export type NotificacionCreateOrConnectWithoutMensajeInput = {
    where: NotificacionWhereUniqueInput
    create: XOR<NotificacionCreateWithoutMensajeInput, NotificacionUncheckedCreateWithoutMensajeInput>
  }

  export type EmpresaUpsertWithoutMensajesEnviadosInput = {
    update: XOR<EmpresaUpdateWithoutMensajesEnviadosInput, EmpresaUncheckedUpdateWithoutMensajesEnviadosInput>
    create: XOR<EmpresaCreateWithoutMensajesEnviadosInput, EmpresaUncheckedCreateWithoutMensajesEnviadosInput>
    where?: EmpresaWhereInput
  }

  export type EmpresaUpdateToOneWithWhereWithoutMensajesEnviadosInput = {
    where?: EmpresaWhereInput
    data: XOR<EmpresaUpdateWithoutMensajesEnviadosInput, EmpresaUncheckedUpdateWithoutMensajesEnviadosInput>
  }

  export type EmpresaUpdateWithoutMensajesEnviadosInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vacantes?: VacanteUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaUncheckedUpdateWithoutMensajesEnviadosInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    phones?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    nit?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    companyType?: StringFieldUpdateOperationsInput | string
    economicSector?: EmpresaUpdateeconomicSectorInput | string[]
    foundationYear?: IntFieldUpdateOperationsInput | number
    employees?: StringFieldUpdateOperationsInput | string
    annualRevenue?: StringFieldUpdateOperationsInput | string
    totalAssets?: NullableStringFieldUpdateOperationsInput | string | null
    equity?: NullableStringFieldUpdateOperationsInput | string | null
    distributionChannels?: EmpresaUpdatedistributionChannelsInput | string[]
    mainClients?: StringFieldUpdateOperationsInput | string
    emailAuthorization?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vacantes?: VacanteUncheckedUpdateManyWithoutEmpresaNestedInput
  }

  export type UsuarioUpsertWithoutMensajesEnviadosInput = {
    update: XOR<UsuarioUpdateWithoutMensajesEnviadosInput, UsuarioUncheckedUpdateWithoutMensajesEnviadosInput>
    create: XOR<UsuarioCreateWithoutMensajesEnviadosInput, UsuarioUncheckedCreateWithoutMensajesEnviadosInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutMensajesEnviadosInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutMensajesEnviadosInput, UsuarioUncheckedUpdateWithoutMensajesEnviadosInput>
  }

  export type UsuarioUpdateWithoutMensajesEnviadosInput = {
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUpdateManyWithoutUsuarioNestedInput
    mensajesRecibidos?: MensajeUpdateManyWithoutReceiverNestedInput
    notificaciones?: NotificacionUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutMensajesEnviadosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUncheckedUpdateManyWithoutUsuarioNestedInput
    mensajesRecibidos?: MensajeUncheckedUpdateManyWithoutReceiverNestedInput
    notificaciones?: NotificacionUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUpsertWithoutMensajesRecibidosInput = {
    update: XOR<UsuarioUpdateWithoutMensajesRecibidosInput, UsuarioUncheckedUpdateWithoutMensajesRecibidosInput>
    create: XOR<UsuarioCreateWithoutMensajesRecibidosInput, UsuarioUncheckedCreateWithoutMensajesRecibidosInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutMensajesRecibidosInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutMensajesRecibidosInput, UsuarioUncheckedUpdateWithoutMensajesRecibidosInput>
  }

  export type UsuarioUpdateWithoutMensajesRecibidosInput = {
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUpdateManyWithoutUsuarioNestedInput
    mensajesEnviados?: MensajeUpdateManyWithoutSenderUsuarioNestedInput
    notificaciones?: NotificacionUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutMensajesRecibidosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUncheckedUpdateManyWithoutUsuarioNestedInput
    mensajesEnviados?: MensajeUncheckedUpdateManyWithoutSenderUsuarioNestedInput
    notificaciones?: NotificacionUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type NotificacionUpsertWithoutMensajeInput = {
    update: XOR<NotificacionUpdateWithoutMensajeInput, NotificacionUncheckedUpdateWithoutMensajeInput>
    create: XOR<NotificacionCreateWithoutMensajeInput, NotificacionUncheckedCreateWithoutMensajeInput>
    where?: NotificacionWhereInput
  }

  export type NotificacionUpdateToOneWithWhereWithoutMensajeInput = {
    where?: NotificacionWhereInput
    data: XOR<NotificacionUpdateWithoutMensajeInput, NotificacionUncheckedUpdateWithoutMensajeInput>
  }

  export type NotificacionUpdateWithoutMensajeInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    usuario?: UsuarioUpdateOneRequiredWithoutNotificacionesNestedInput
  }

  export type NotificacionUncheckedUpdateWithoutMensajeInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type MensajeCreateWithoutNotificacionInput = {
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresa?: EmpresaCreateNestedOneWithoutMensajesEnviadosInput
    senderUsuario?: UsuarioCreateNestedOneWithoutMensajesEnviadosInput
    receiver: UsuarioCreateNestedOneWithoutMensajesRecibidosInput
  }

  export type MensajeUncheckedCreateWithoutNotificacionInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresaId?: number | null
    senderUsuarioId?: number | null
    receiverId: number
  }

  export type MensajeCreateOrConnectWithoutNotificacionInput = {
    where: MensajeWhereUniqueInput
    create: XOR<MensajeCreateWithoutNotificacionInput, MensajeUncheckedCreateWithoutNotificacionInput>
  }

  export type UsuarioCreateWithoutNotificacionesInput = {
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionCreateNestedManyWithoutUsuarioInput
    mensajesEnviados?: MensajeCreateNestedManyWithoutSenderUsuarioInput
    mensajesRecibidos?: MensajeCreateNestedManyWithoutReceiverInput
  }

  export type UsuarioUncheckedCreateWithoutNotificacionesInput = {
    id?: number
    nombres: string
    apellidos: string
    usuario: string
    correo: string
    password?: string | null
    firebaseUid?: string | null
    rol?: string
    postulaciones?: PostulacionUncheckedCreateNestedManyWithoutUsuarioInput
    mensajesEnviados?: MensajeUncheckedCreateNestedManyWithoutSenderUsuarioInput
    mensajesRecibidos?: MensajeUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UsuarioCreateOrConnectWithoutNotificacionesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutNotificacionesInput, UsuarioUncheckedCreateWithoutNotificacionesInput>
  }

  export type MensajeUpsertWithoutNotificacionInput = {
    update: XOR<MensajeUpdateWithoutNotificacionInput, MensajeUncheckedUpdateWithoutNotificacionInput>
    create: XOR<MensajeCreateWithoutNotificacionInput, MensajeUncheckedCreateWithoutNotificacionInput>
    where?: MensajeWhereInput
  }

  export type MensajeUpdateToOneWithWhereWithoutNotificacionInput = {
    where?: MensajeWhereInput
    data: XOR<MensajeUpdateWithoutNotificacionInput, MensajeUncheckedUpdateWithoutNotificacionInput>
  }

  export type MensajeUpdateWithoutNotificacionInput = {
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresa?: EmpresaUpdateOneWithoutMensajesEnviadosNestedInput
    senderUsuario?: UsuarioUpdateOneWithoutMensajesEnviadosNestedInput
    receiver?: UsuarioUpdateOneRequiredWithoutMensajesRecibidosNestedInput
  }

  export type MensajeUncheckedUpdateWithoutNotificacionInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresaId?: NullableIntFieldUpdateOperationsInput | number | null
    senderUsuarioId?: NullableIntFieldUpdateOperationsInput | number | null
    receiverId?: IntFieldUpdateOperationsInput | number
  }

  export type UsuarioUpsertWithoutNotificacionesInput = {
    update: XOR<UsuarioUpdateWithoutNotificacionesInput, UsuarioUncheckedUpdateWithoutNotificacionesInput>
    create: XOR<UsuarioCreateWithoutNotificacionesInput, UsuarioUncheckedCreateWithoutNotificacionesInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutNotificacionesInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutNotificacionesInput, UsuarioUncheckedUpdateWithoutNotificacionesInput>
  }

  export type UsuarioUpdateWithoutNotificacionesInput = {
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUpdateManyWithoutUsuarioNestedInput
    mensajesEnviados?: MensajeUpdateManyWithoutSenderUsuarioNestedInput
    mensajesRecibidos?: MensajeUpdateManyWithoutReceiverNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutNotificacionesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    usuario?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    firebaseUid?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    postulaciones?: PostulacionUncheckedUpdateManyWithoutUsuarioNestedInput
    mensajesEnviados?: MensajeUncheckedUpdateManyWithoutSenderUsuarioNestedInput
    mensajesRecibidos?: MensajeUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type PostulacionCreateManyUsuarioInput = {
    id?: number
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    vacanteId: number
  }

  export type MensajeCreateManySenderUsuarioInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresaId?: number | null
    receiverId: number
  }

  export type MensajeCreateManyReceiverInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderEmpresaId?: number | null
    senderUsuarioId?: number | null
  }

  export type NotificacionCreateManyUsuarioInput = {
    id?: number
    tipo: string
    contenido: string
    fecha?: Date | string
    vista?: boolean
    referenciaId?: number | null
    mensajeId?: number | null
  }

  export type PostulacionUpdateWithoutUsuarioInput = {
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vacante?: VacanteUpdateOneRequiredWithoutPostulacionesNestedInput
  }

  export type PostulacionUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vacanteId?: IntFieldUpdateOperationsInput | number
  }

  export type PostulacionUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vacanteId?: IntFieldUpdateOperationsInput | number
  }

  export type MensajeUpdateWithoutSenderUsuarioInput = {
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresa?: EmpresaUpdateOneWithoutMensajesEnviadosNestedInput
    receiver?: UsuarioUpdateOneRequiredWithoutMensajesRecibidosNestedInput
    notificacion?: NotificacionUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeUncheckedUpdateWithoutSenderUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresaId?: NullableIntFieldUpdateOperationsInput | number | null
    receiverId?: IntFieldUpdateOperationsInput | number
    notificacion?: NotificacionUncheckedUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeUncheckedUpdateManyWithoutSenderUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresaId?: NullableIntFieldUpdateOperationsInput | number | null
    receiverId?: IntFieldUpdateOperationsInput | number
  }

  export type MensajeUpdateWithoutReceiverInput = {
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresa?: EmpresaUpdateOneWithoutMensajesEnviadosNestedInput
    senderUsuario?: UsuarioUpdateOneWithoutMensajesEnviadosNestedInput
    notificacion?: NotificacionUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeUncheckedUpdateWithoutReceiverInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresaId?: NullableIntFieldUpdateOperationsInput | number | null
    senderUsuarioId?: NullableIntFieldUpdateOperationsInput | number | null
    notificacion?: NotificacionUncheckedUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeUncheckedUpdateManyWithoutReceiverInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderEmpresaId?: NullableIntFieldUpdateOperationsInput | number | null
    senderUsuarioId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type NotificacionUpdateWithoutUsuarioInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    mensaje?: MensajeUpdateOneWithoutNotificacionNestedInput
  }

  export type NotificacionUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    mensajeId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type NotificacionUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    contenido?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    vista?: BoolFieldUpdateOperationsInput | boolean
    referenciaId?: NullableIntFieldUpdateOperationsInput | number | null
    mensajeId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type VacanteCreateManyEmpresaInput = {
    id?: number
    titulo: string
    descripcion: string
    ubicacion: string
    tipo: string
    modalidad: string
    salario?: string | null
    fechaCreacion?: Date | string
  }

  export type MensajeCreateManySenderEmpresaInput = {
    id?: number
    contenido: string
    fechaEnvio?: Date | string
    read?: boolean
    senderType: string
    senderUsuarioId?: number | null
    receiverId: number
  }

  export type VacanteUpdateWithoutEmpresaInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    postulaciones?: PostulacionUpdateManyWithoutVacanteNestedInput
  }

  export type VacanteUncheckedUpdateWithoutEmpresaInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    postulaciones?: PostulacionUncheckedUpdateManyWithoutVacanteNestedInput
  }

  export type VacanteUncheckedUpdateManyWithoutEmpresaInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    modalidad?: StringFieldUpdateOperationsInput | string
    salario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MensajeUpdateWithoutSenderEmpresaInput = {
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderUsuario?: UsuarioUpdateOneWithoutMensajesEnviadosNestedInput
    receiver?: UsuarioUpdateOneRequiredWithoutMensajesRecibidosNestedInput
    notificacion?: NotificacionUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeUncheckedUpdateWithoutSenderEmpresaInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderUsuarioId?: NullableIntFieldUpdateOperationsInput | number | null
    receiverId?: IntFieldUpdateOperationsInput | number
    notificacion?: NotificacionUncheckedUpdateOneWithoutMensajeNestedInput
  }

  export type MensajeUncheckedUpdateManyWithoutSenderEmpresaInput = {
    id?: IntFieldUpdateOperationsInput | number
    contenido?: StringFieldUpdateOperationsInput | string
    fechaEnvio?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderType?: StringFieldUpdateOperationsInput | string
    senderUsuarioId?: NullableIntFieldUpdateOperationsInput | number | null
    receiverId?: IntFieldUpdateOperationsInput | number
  }

  export type PostulacionCreateManyVacanteInput = {
    id?: number
    telefono?: string | null
    cv_url?: string | null
    estado?: string
    fecha?: Date | string
    usuarioId: number
  }

  export type PostulacionUpdateWithoutVacanteInput = {
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutPostulacionesNestedInput
  }

  export type PostulacionUncheckedUpdateWithoutVacanteInput = {
    id?: IntFieldUpdateOperationsInput | number
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type PostulacionUncheckedUpdateManyWithoutVacanteInput = {
    id?: IntFieldUpdateOperationsInput | number
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    cv_url?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}