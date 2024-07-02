---
title: Query modules Rust API
description: Get your hands on the API documentation, covering declarations of every function in the Rust API for implementing query modules.
---

# Query modules Rust API

This is the API documentation for the Rust binding of Memgraph's C API, which contains declarations of all
functions for implementing query module procedures and functions.
The source files can be found in the Memgraph MAGE file structure (in the `memgraph-mage-dev` Docker images, 
they can be found under `/mage/rust`). On Github, it can be found 
under the [rust file structure](https://github.com/memgraph/mage/tree/main/rust).  

To see how to implement query modules in C++, take a look at
[the example we provided](/custom-query-modules/rust/rust-example).

## Functions and procedures

### Memgraph Procedure API

#### Memgraph

##### new

Creates a new `Memgraph` object.

```rust
pub fn new(
    args: *mut mgp_list,
    graph: *mut mgp_graph,
    result: *mut mgp_result,
    memory: *mut mgp_memory,
    module: *mut mgp_module
) -> Memgraph
```

- **Parameters**:
  - `args`: A pointer to `mgp_list`.
  - `graph`: A pointer to `mgp_graph`.
  - `result`: A pointer to `mgp_result`.
  - `memory`: A pointer to `mgp_memory`.
  - `module`: A pointer to `mgp_module`.
- **Returns**: A new instance of `Memgraph`.

##### new_default

Creates a new `Memgraph` object with all underlying data set to null. Used for testing purposes.

```rust
#[cfg(test)]
pub(crate) fn new_default() -> Memgraph
```

- **Returns**: A new instance of `Memgraph` with default values.

##### args

Returns the arguments passed to the procedure call.

```rust
pub fn args(&self) -> Result<List>
```

- **Returns**: A `Result` containing the `List` of arguments if successful.

##### args_ptr

Returns a pointer to the object with all arguments passed to the procedure call.

```rust
pub(crate) fn args_ptr(&self) -> *mut mgp_list
```

- **Returns**: A pointer to `mgp_list`.

##### graph_ptr

Returns a pointer to the object with graph data.

```rust
pub(crate) fn graph_ptr(&self) -> *mut mgp_graph
```

- **Returns**: A pointer to `mgp_graph`.

##### result_ptr

Returns a pointer to the object where results could be stored.

```rust
pub(crate) fn result_ptr(&self) -> *mut mgp_result
```

- **Returns**: A pointer to `mgp_result`.

##### memory_ptr

Returns a pointer to the memory object for advanced memory control.

```rust
pub(crate) fn memory_ptr(&self) -> *mut mgp_memory
```

- **Returns**: A pointer to `mgp_memory`.

##### module_ptr

Returns a pointer to the module object.

```rust
pub fn module_ptr(&self) -> *mut mgp_module
```

- **Returns**: A pointer to `mgp_module`.

##### vertices_iter

Returns an iterator over the vertices in the graph.

```rust
pub fn vertices_iter(&self) -> Result<VerticesIterator>
```

- **Returns**: A `Result` containing a `VerticesIterator` if successful.

##### vertex_by_id

Returns a vertex with the given ID.

```rust
pub fn vertex_by_id(&self, id: i64) -> Result<Vertex>
```

- **Parameters**:
  - `id`: The ID of the vertex to retrieve.
- **Returns**: A `Result` containing the `Vertex` if successful.

##### result_record

Creates a new result record.

```rust
pub fn result_record(&self) -> Result<ResultRecord>
```

- **Returns**: A `Result` containing a new `ResultRecord` if successful.

##### add_read_procedure

Registers a new read procedure.

```rust
pub fn add_read_procedure(
    &self,
    proc_ptr: extern "C" fn(*mut mgp_list, *mut mgp_graph, *mut mgp_result, *mut mgp_memory),
    name: &CStr,
    required_arg_types: &[NamedType],
    optional_arg_types: &[OptionalNamedType],
    result_field_types: &[NamedType]
) -> Result<()>
```

- **Parameters**:
  - `proc_ptr`: Identifier of the top-level C function that represents the procedure.
  - `name`: A string that will be registered as a procedure name inside the Memgraph instance.
  - `required_arg_types`: An array of all `NamedType`s, each one defined by name and an array of `Type`s.
  - `optional_arg_types`: An array of all `OptionalNamedType`s, each one defined by name, an array of `Type`s, and default value.
  - `result_field_types`: An array of all `NamedType`s, each one defined by name and an array of `Type`s.
- **Returns**: A `Result` indicating success or failure.

##### must_abort

Returns `true` if the currently executing procedure should abort as soon as possible.

```rust
pub fn must_abort(&self) -> bool
```

- **Returns**: `true` if the procedure should abort, `false` otherwise.

#### MgpError

Defines various errors that can occur in the API.

```rust
#[derive(Debug, PartialEq)]
pub enum MgpError {
    UnknownError,
    UnableToAllocate,
    InsufficientError,
    OutOfRange,
    LogicError,
    DeletedObject,
    InvalidArgument,
    KeyAlreadyExists,
    ImmutableObject,
    ValueConversion,
    SerializationError,
}
```

#### MgpDefault

A trait to define default values for various types.

```rust
pub(crate) trait MgpDefault {
    fn default() -> Self;
}
```

#### to_rust_mgp_error

Converts a `mgp_error` to an `MgpError`.

```rust
pub(crate) fn to_rust_mgp_error(error: mgp_error) -> Option<MgpError>
```

- **Parameters**:
  - `error`: A `mgp_error`.
- **Returns**: An `Option` containing an `MgpError` if the error is not `MGP_ERROR_NO_ERROR`.

#### invoke_mgp_func

A macro to invoke a Memgraph function and handle the result.

```rust
macro_rules! invoke_mgp_func {
    ($result_type:ty, $func:expr) => {{ ... }};
    ($result_type:ty, $func:expr, $($args:expr),+) => {{ ... }};
}
```

#### invoke_void_mgp_func

A macro to invoke a Memgraph function that returns void and handle the result.

```rust
macro_rules! invoke_void_mgp_func {
    ($func:expr, $($args:expr),+) => {{ ... }};
}
```

#### invoke_mgp_func_with_res

A macro to invoke a Memgraph function and map the result to a custom error.

```rust
macro_rules! invoke_mgp_func_with_res {
    ($result_type:ty, $err:expr, $func:expr) => {{ ... }};
    ($result_type:ty, $err:expr, $func:expr, $($args:expr),+) => {{ ... }};
}
```

#### invoke_void_mgp_func_with_res

A macro to invoke a Memgraph function that returns void and map the result to a custom error.

```rust
macro_rules! invoke_void_mgp_func_with_res {
    ($err:expr, $func:expr, $($args:expr),+) => {{ ... }};
}
```

#### resolve_mgp_type

Combines the given array of types from left to right to construct `mgp_type`.

```rust
fn resolve_mgp_type(types: &[Type]) -> *mut mgp_type
```

- **Parameters**:
  - `types`: A slice of `Type`s.
- **Returns**: A pointer to the constructed `mgp_type`.

### Graph API

#### VerticesIterator

##### new

Creates a new `VerticesIterator`.

```rust
pub(crate) fn new(ptr: *mut mgp_vertices_iterator, memgraph: &Memgraph) -> VerticesIterator
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_vertices_iterator`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `VerticesIterator`.

##### next

Returns the next vertex in the iteration.

```rust
fn next(&mut self) -> Option<Vertex>
```

- **Returns**: An `Option` containing the next `Vertex` if available, otherwise `None`.

##### Drop

Drops the `VerticesIterator` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### Vertex

##### new

Creates a new `Vertex`.

```rust
pub(crate) fn new(ptr: *mut mgp_vertex, memgraph: &Memgraph) -> Vertex
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_vertex`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `Vertex`.

##### mgp_copy

Creates a new `Vertex` based on an `mgp_vertex`.

```rust
pub(crate) unsafe fn mgp_copy(mgp_vertex: *mut mgp_vertex, memgraph: &Memgraph) -> Result<Vertex>
```

- **Parameters**:
  - `mgp_vertex`: A pointer to `mgp_vertex`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `Vertex` instance if successful.

##### mgp_ptr

Returns the underlying `mgp_vertex` pointer.

```rust
pub(crate) fn mgp_ptr(&self) -> *mut mgp_vertex
```

- **Returns**: A pointer to `mgp_vertex`.

##### set_mgp_ptr

Sets a new `mgp_vertex` pointer.

```rust
pub(crate) fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_vertex)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_vertex`.

##### id

Returns the ID of the `Vertex`.

```rust
pub fn id(&self) -> i64
```

- **Returns**: The ID of the `Vertex`.

##### labels_count

Returns the number of labels associated with the `Vertex`.

```rust
pub fn labels_count(&self) -> Result<u64>
```

- **Returns**: A `Result` containing the number of labels as `u64` if successful.

##### label_at

Returns the label at the specified index.

```rust
pub fn label_at(&self, index: u64) -> Result<CString>
```

- **Parameters**:
  - `index`: The index of the label.
- **Returns**: A `Result` containing the label as a `CString` if successful.

##### has_label

Checks if the `Vertex` has the specified label.

```rust
pub fn has_label(&self, name: &CStr) -> Result<bool>
```

- **Parameters**:
  - `name`: The name of the label as a `CStr`.
- **Returns**: A `Result` containing `true` if the `Vertex` has the label, otherwise `false`.

##### property

Returns the value of a property of the `Vertex`.

```rust
pub fn property(&self, name: &CStr) -> Result<Property>
```

- **Parameters**:
  - `name`: The name of the property as a `CStr`.
- **Returns**: A `Result` containing the `Property` if successful.

##### properties

Returns an iterator over the properties of the `Vertex`.

```rust
pub fn properties(&self) -> Result<PropertiesIterator>
```

- **Returns**: A `Result` containing a `PropertiesIterator` if successful.

##### in_edges

Returns an iterator over the incoming edges of the `Vertex`.

```rust
pub fn in_edges(&self) -> Result<EdgesIterator>
```

- **Returns**: A `Result` containing an `EdgesIterator` if successful.

##### out_edges

Returns an iterator over the outgoing edges of the `Vertex`.

```rust
pub fn out_edges(&self) -> Result<EdgesIterator>
```

- **Returns**: A `Result` containing an `EdgesIterator` if successful.

##### Drop

Drops the `Vertex` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### EdgesIterator

##### new

Creates a new `EdgesIterator`.

```rust
pub(crate) fn new(ptr: *mut mgp_edges_iterator, memgraph: &Memgraph) -> EdgesIterator
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_edges_iterator`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `EdgesIterator`.

##### next

Returns the next edge in the iteration.

```rust
fn next(&mut self) -> Option<Edge>
```

- **Returns**: An `Option` containing the next `Edge` if available, otherwise `None`.

##### Drop

Drops the `EdgesIterator` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### Edge

##### new

Creates a new `Edge`.

```rust
pub(crate) fn new(ptr: *mut mgp_edge, memgraph: &Memgraph) -> Edge
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_edge`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `Edge`.

##### mgp_copy

Creates a new `Edge` based on an `mgp_edge`.

```rust
pub(crate) unsafe fn mgp_copy(ptr: *mut mgp_edge, memgraph: &Memgraph) -> Result<Edge>
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_edge`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `Edge` instance if successful.

##### mgp_ptr

Returns the underlying `mgp_edge` pointer.

```rust
pub(crate) fn mgp_ptr(&self) -> *mut mgp_edge
```

- **Returns**: A pointer to `mgp_edge`.

##### set_mgp_ptr

Sets a new `mgp_edge` pointer.

```rust
pub(crate) fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_edge)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_edge`.

##### copy

Creates a copy of the `Edge`.

```rust
pub fn copy(&self) -> Result<Edge>
```

- **Returns**: A `Result` containing the copied `Edge` if successful.

##### id

Returns the ID of the `Edge`.

```rust
pub fn id(&self) -> i64
```

- **Returns**: The ID of the `Edge`.

##### edge_type

Returns the type of the `Edge`.

```rust
pub fn edge_type(&self) -> Result<CString>
```

- **Returns**: A `Result` containing the type of the `Edge` as a `CString` if successful.

##### from_vertex

Returns the vertex from which the `Edge` originates.

```rust
pub fn from_vertex(&self) -> Result<Vertex>
```

- **Returns**: A `Result` containing the originating `Vertex` if successful.

##### to_vertex

Returns the vertex to which the `Edge` points.

```rust
pub fn to_vertex(&self) -> Result<Vertex>
```

- **Returns**: A `Result` containing the destination `Vertex` if successful.

##### property

Returns the value of a property of the `Edge`.

```rust
pub fn property(&self, name: &CStr) -> Result<Property>
```

- **Parameters**:
  - `name`: The name of the property as a `CStr`.
- **Returns**: A `Result` containing the `Property` if successful.

##### properties

Returns an iterator over the properties of the `Edge`.

```rust
pub fn properties(&self) -> Result<PropertiesIterator>
```

- **Returns**: A `Result` containing a `PropertiesIterator` if successful.

##### Drop

Drops the `Edge` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### List

##### new

Creates a new `List`.

```rust
pub(crate) fn new(ptr: *mut mgp_list, memgraph: &Memgraph) -> List
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_list`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `List`.

##### make_empty

Creates an empty `List` with the specified capacity.

```rust
pub fn make_empty(capacity: u64, memgraph: &Memgraph) -> Result<List>
```

- **Parameters**:
  - `capacity`: The initial capacity of the list.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `List` if successful.

##### mgp_copy

Creates a copy of an existing `List`.

```rust
pub(crate) unsafe fn mgp_copy(ptr: *mut mgp_list, memgraph: &Memgraph) -> Result<List>
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_list`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a copied `List` if successful.

##### copy

Creates a copy of the current `List`.

```rust
pub fn copy(&self) -> Result<List>
```

- **Returns**: A `Result` containing the copied `List` if successful.

##### append

Appends a value to the `List`. Returns an error if there is no space.

```rust
pub fn append(&self, value: &Value) -> Result<()>
```

- **Parameters**:
  - `value`: The `Value` to append.
- **Returns**: A `Result` indicating success or failure.

##### append_extend

Appends a value to the `List`, extending the capacity if necessary.

```rust
pub fn append_extend(&self, value: &Value) -> Result<()>
```

- **Parameters**:
  - `value`: The `Value` to append.
- **Returns**: A `Result` indicating success or failure.

##### size

Returns the size of the `List`.

```rust
pub fn size(&self) -> u64
```

- **Returns**: The size of the `List`.

##### capacity

Returns the capacity of the `List`.

```rust
pub fn capacity(&self) -> u64
```

- **Returns**: The capacity of the `List`.

##### value_at

Returns the value at the specified index.

```rust
pub fn value_at(&self, index: u64) -> Result<Value>
```

- **Parameters**:
  - `index`: The index of the value to retrieve.
- **Returns**: A `Result` containing the `Value` if successful.

##### iter

Returns an iterator over the `List`.

```rust
pub fn iter(&self) -> Result<ListIterator>
```

- **Returns**: A `Result` containing a `ListIterator` if successful.

##### mgp_ptr

Returns the underlying `mgp_list` pointer.

```rust
pub(crate) fn mgp_ptr(&self) -> *mut mgp_list
```

- **Returns**: A pointer to `mgp_list`.

##### set_mgp_ptr

Sets a new `mgp_list` pointer.

```rust
pub(crate) fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_list)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_list`.

##### Drop

Drops the `List` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### ListIterator

##### next

Returns the next value in the iteration.

```rust
fn next(&mut self) -> Option<Value>
```

- **Returns**: An `Option` containing the next `Value` if available, otherwise `None`.

#### Map

##### new

Creates a new `Map`.

```rust
pub(crate) fn new(ptr: *mut mgp_map, memgraph: &Memgraph) -> Map
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_map`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `Map`.

##### mgp_copy

Creates a copy of an existing `Map`.

```rust
pub(crate) unsafe fn mgp_copy(ptr: *mut mgp_map, memgraph: &Memgraph) -> Result<Map>
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_map`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a copied `Map` if successful.

##### make_empty

Creates an empty `Map`.

```rust
pub fn make_empty(memgraph: &Memgraph) -> Result<Map>
```

- **Parameters**:
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new empty `Map` if successful.

##### insert

Inserts a key-value pair into the `Map`.

```rust
pub fn insert(&self, key: &CStr, value: &Value) -> Result<()>
```

- **Parameters**:
  - `key`: The key as a `CStr`.
  - `value`: The value to insert.
- **Returns**: A `Result` indicating success or failure.

##### size

Returns the size of the `Map`.

```rust
pub fn size(&self) -> u64
```

- **Returns**: The size of the `Map`.

##### at

Returns the value associated with the specified key.

```rust
pub fn at(&self, key: &CStr) -> Result<Value>
```

- **Parameters**:
  - `key`: The key as a `CStr`.
- **Returns**: A `Result` containing the `Value` if successful.

##### iter

Returns an iterator over the `Map`.

```rust
pub fn iter(&self) -> Result<MapIterator>
```

- **Returns**: A `Result` containing a `MapIterator` if successful.

##### mgp_ptr

Returns the underlying `mgp_map` pointer.

```rust
pub(crate) fn mgp_ptr(&self) -> *mut mgp_map
```

- **Returns**: A pointer to `mgp_map`.

##### set_mgp_ptr

Sets a new `mgp_map` pointer.

```rust
pub(crate) fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_map)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_map`.

##### Drop

Drops the `Map` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### MapItem

##### Fields

Represents an item in the `Map` with a key-value pair.

- **key**: The key as a `CString`.
- **value**: The value as a `Value`.

```rust
pub struct MapItem {
    pub key: CString,
    pub value: Value,
}
```

#### MapIterator

##### new

Creates a new `MapIterator`.

```rust
pub(crate) fn new(ptr: *mut mgp_map_items_iterator, memgraph: &Memgraph) -> MapIterator
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_map_items_iterator`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `MapIterator`.

##### next

Returns the next item in the iteration.

```rust
fn next(&mut self) -> Option<MapItem>
```

- **Returns**: An `Option` containing the next `MapItem` if available, otherwise `None`.

##### Drop

Drops the `MapIterator` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### MgpValue

##### new

Creates a new `MgpValue`.

```rust
pub(crate) fn new(ptr: *mut mgp_value, memgraph: &Memgraph) -> MgpValue
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_value`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `MgpValue`.

##### mgp_ptr

Returns the underlying `mgp_value` pointer.

```rust
pub(crate) fn mgp_ptr(&self) -> *mut mgp_value
```

- **Returns**: A pointer to `mgp_value`.

##### to_value

Converts the `MgpValue` to a `Value`.

```rust
pub fn to_value(&self) -> Result<Value>
```

- **Returns**: A `Result` containing the `Value` if successful.

##### make_null

Creates a `MgpValue` representing a null value.

```rust
pub fn make_null(memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_null

Checks if the `MgpValue` is null.

```rust
pub fn is_null(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is null, otherwise `false`.

##### make_bool

Creates a `MgpValue` representing a boolean value.

```rust
pub fn make_bool(value: bool, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `value`: The boolean value.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_bool

Checks if the `MgpValue` is a boolean.

```rust
pub fn is_bool(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a boolean, otherwise `false`.

##### make_int

Creates a `MgpValue` representing an integer value.

```rust
pub fn make_int(value: i64, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `value`: The integer value.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_int

Checks if the `MgpValue` is an integer.

```rust
pub fn is_int(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is an integer, otherwise `false`.

##### make_double

Creates a `MgpValue` representing a double value.

```rust
pub fn make_double(value: f64, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `value`: The double value.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_double

Checks if the `MgpValue` is a double.

```rust
pub fn is_double(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a double, otherwise `false`.

##### make_string

Creates a `MgpValue` representing a string value.

```rust
pub fn make_string(value: &CStr, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `value`: The string value as a `CStr`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_string

Checks if the `MgpValue` is a string.

```rust
pub fn is_string(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a string, otherwise `false`.

##### make_list

Creates a `MgpValue` representing a list value.

```rust
pub fn make_list(list: &List, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `list`: The `List` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_list

Checks if the `MgpValue` is a list.

```rust
pub fn is_list(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a list, otherwise `false`.

##### make_map

Creates a `MgpValue` representing a map value.

```rust
pub fn make_map(map: &Map, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `map`: The `Map` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_map

Checks if the `MgpValue` is a map.

```rust
pub fn is_map(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a map, otherwise `false`.

##### make_vertex

Creates a `MgpValue` representing a vertex value.

```rust
pub fn make_vertex(vertex: &Vertex, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `vertex`: The `Vertex` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_vertex

Checks if the `MgpValue` is a vertex.

```rust
pub fn is_vertex(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a vertex, otherwise `false`.

##### make_edge

Creates a `MgpValue` representing an edge value.

```rust
pub fn make_edge(edge: &Edge, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `edge`: The `Edge` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_edge

Checks if the `MgpValue` is an edge.

```rust
pub fn is_edge(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is an edge, otherwise `false`.

##### make_path

Creates a `MgpValue` representing a path value.

```rust
pub fn make_path(path: &Path, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `path`: The `Path` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_path

Checks if the `MgpValue` is a path.

```rust
pub fn is_path(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a path, otherwise `false`.

##### make_date

Creates a `MgpValue` representing a date value.

```rust
pub fn make_date(date: &NaiveDate, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `date`: The `NaiveDate` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_date

Checks if the `MgpValue` is a date.

```rust
pub fn is_date(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a date, otherwise `false`.

##### make_local_time

Creates a `MgpValue` representing a local time value.

```rust
pub fn make_local_time(time: &NaiveTime, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `time`: The `NaiveTime` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_local_time

Checks if the `MgpValue` is a local time.

```rust
pub fn is_local_time(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a local time, otherwise `false`.

##### make_local_date_time

Creates a `MgpValue` representing a local date-time value.

```rust
pub fn make_local_date_time(datetime: &NaiveDateTime

, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `datetime`: The `NaiveDateTime` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_local_date_time

Checks if the `MgpValue` is a local date-time.

```rust
pub fn is_local_date_time(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a local date-time, otherwise `false`.

##### make_duration

Creates a `MgpValue` representing a duration value.

```rust
pub fn make_duration(duration: &chrono::Duration, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `duration`: The `Duration` to be converted.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `MgpValue` if successful.

##### is_duration

Checks if the `MgpValue` is a duration.

```rust
pub fn is_duration(&self) -> bool
```

- **Returns**: `true` if the `MgpValue` is a duration, otherwise `false`.

##### Drop

Drops the `MgpValue` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### Path

##### new

Creates a new `Path`.

```rust
pub(crate) fn new(ptr: *mut mgp_path, memgraph: &Memgraph) -> Path
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_path`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `Path`.

##### mgp_copy

Creates a copy of an existing `Path`.

```rust
pub(crate) unsafe fn mgp_copy(mgp_path: *mut mgp_path, memgraph: &Memgraph) -> Result<Path>
```

- **Parameters**:
  - `mgp_path`: A pointer to `mgp_path`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a copied `Path` if successful.

##### mgp_ptr

Returns the underlying `mgp_path` pointer.

```rust
pub(crate) fn mgp_ptr(&self) -> *mut mgp_path
```

- **Returns**: A pointer to `mgp_path`.

##### set_mgp_ptr

Sets a new `mgp_path` pointer.

```rust
pub(crate) fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_path)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_path`.

##### size

Returns the size of the `Path`.

```rust
pub fn size(&self) -> u64
```

- **Returns**: The size of the `Path`.

##### make_with_start

Creates a new `Path` starting with the specified `Vertex`.

```rust
pub fn make_with_start(vertex: &Vertex, memgraph: &Memgraph) -> Result<Path>
```

- **Parameters**:
  - `vertex`: The starting `Vertex`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `Path` if successful.

##### expand

Expands the `Path` by adding an `Edge`. Fails if the current last vertex in the path is not part of the given edge or if there is no memory to expand the path.

```rust
pub fn expand(&self, edge: &Edge) -> Result<()>
```

- **Parameters**:
  - `edge`: The `Edge` to add.
- **Returns**: A `Result` indicating success or failure.

##### vertex_at

Returns the `Vertex` at the specified index.

```rust
pub fn vertex_at(&self, index: u64) -> Result<Vertex>
```

- **Parameters**:
  - `index`: The index of the `Vertex` to retrieve.
- **Returns**: A `Result` containing the `Vertex` if successful.

##### edge_at

Returns the `Edge` at the specified index.

```rust
pub fn edge_at(&self, index: u64) -> Result<Edge>
```

- **Parameters**:
  - `index`: The index of the `Edge` to retrieve.
- **Returns**: A `Result` containing the `Edge` if successful.

##### Drop

Drops the `Path` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### Property

Represents a property with a name and value.

```rust
pub struct Property {
    pub name: CString,
    pub value: Value,
}
```

- **Fields**:
  - `name`: The name of the property as a `CString`.
  - `value`: The value of the property as a `Value`.

#### PropertiesIterator

##### new

Creates a new `PropertiesIterator`.

```rust
pub(crate) fn new(ptr: *mut mgp_properties_iterator, memgraph: &Memgraph) -> PropertiesIterator
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_properties_iterator`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A new instance of `PropertiesIterator`.

##### next

Returns the next property in the iteration.

```rust
fn next(&mut self) -> Option<Property>
```

- **Returns**: An `Option` containing the next `Property` if available, otherwise `None`.

##### Drop

Drops the `PropertiesIterator` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### ResultRecord

##### create

Creates a new `ResultRecord`.

```rust
pub fn create(memgraph: &Memgraph) -> Result<ResultRecord>
```

- **Parameters**:
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `ResultRecord` if successful.

##### insert_mgp_value

Inserts an `MgpValue` into the `ResultRecord`.

```rust
pub fn insert_mgp_value(&self, field: &CStr, value: &MgpValue) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `MgpValue` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_null

Inserts a null value into the `ResultRecord`.

```rust
pub fn insert_null(&self, field: &CStr) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
- **Returns**: A `Result` indicating success or failure.

##### insert_bool

Inserts a boolean value into the `ResultRecord`.

```rust
pub fn insert_bool(&self, field: &CStr, value: bool) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The boolean value to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_int

Inserts an integer value into the `ResultRecord`.

```rust
pub fn insert_int(&self, field: &CStr, value: i64) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The integer value to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_double

Inserts a double value into the `ResultRecord`.

```rust
pub fn insert_double(&self, field: &CStr, value: f64) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The double value to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_string

Inserts a string value into the `ResultRecord`.

```rust
pub fn insert_string(&self, field: &CStr, value: &CStr) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The string value as a `CStr` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_list

Inserts a list value into the `ResultRecord`.

```rust
pub fn insert_list(&self, field: &CStr, value: &List) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `List` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_map

Inserts a map value into the `ResultRecord`.

```rust
pub fn insert_map(&self, field: &CStr, value: &Map) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `Map` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_vertex

Inserts a vertex value into the `ResultRecord`.

```rust
pub fn insert_vertex(&self, field: &CStr, value: &Vertex) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `Vertex` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_edge

Inserts an edge value into the `ResultRecord`.

```rust
pub fn insert_edge(&self, field: &CStr, value: &Edge) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `Edge` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_path

Inserts a path value into the `ResultRecord`.

```rust
pub fn insert_path(&self, field: &CStr, value: &Path) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `Path` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_date

Inserts a date value into the `ResultRecord`.

```rust
pub fn insert_date(&self, field: &CStr, value: &NaiveDate) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `NaiveDate` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_local_time

Inserts a local time value into the `ResultRecord`.

```rust
pub fn insert_local_time(&self, field: &CStr, value: &NaiveTime) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `NaiveTime` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_local_date_time

Inserts a local date-time value into the `ResultRecord`.

```rust
pub fn insert_local_date_time(&self, field: &CStr, value: &NaiveDateTime) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `NaiveDateTime` to insert.
- **Returns**: A `Result` indicating success or failure.

##### insert_duration

Inserts a duration value into the `ResultRecord`.

```rust
pub fn insert_duration(&self, field: &CStr, value: &chrono::Duration) -> Result<()>
```

- **Parameters**:
  - `field`: The field name as a `CStr`.
  - `value`: The `Duration` to insert.
- **Returns**: A `Result` indicating success or failure.

#### Error

Defines various errors that can occur in the API.

```rust
#[derive(Debug, PartialEq, Snafu)]
#[snafu(visibility = "pub")]
pub enum Error {
    UnableToCreateDateFromNaiveDate,
    UnableToCreateDurationFromChronoDuration,
    UnableToCopyEdge,
    UnableToReturnEdgePropertyValueAllocationError,
    UnableToReturnEdgePropertyValueCreationError,
    UnableToReturnEdgePropertyNameAllocationError,
    UnableToReturnEdgePropertyDeletedObjectError,
    UnableToReturnEdgePropertiesIterator,
    UnableToCreateEmptyList,
    UnableToCopyList,
    UnableToAppendListValue,
    UnableToAppendExtendListValue,
    UnableToAccessListValueByIndex,
    UnableToCreateLocalTimeFromNaiveTime,
    UnableToCreateLocalDateTimeFromNaiveDateTime,
    UnableToCopyMap,
    UnableToCreateEmptyMap,
    UnableToInsertMapValue,
    UnableToAccessMapValue,
    UnableToCreateMapIterator,
    UnableToCreateGraphVerticesIterator,
    UnableToFindVertexById,
    UnableToRegisterReadProcedure,
    UnableToAddRequiredArguments,
    UnableToAddOptionalArguments,
    UnableToAddReturnType,
    UnableToAddDeprecatedReturnType,
    UnableToCopyPath,
    OutOfBoundPathVertexIndex,
    OutOfBoundPathEdgeIndex,
    UnableToCreatePathWithStartVertex,
    UnableToExpandPath,
    UnableToCreateResultRecord,
    UnableToInsertResultValue,
    UnableToCreateCString,
    UnableToMakeNullValue,
    UnableToMakeBoolValue,
    UnableToMakeIntegerValue,
    UnableToMakeDoubleValue,
    UnableToMakeMemgraphStringValue,
    UnableToMakeListValue,
    UnableToMakeMapValue,
    UnableToMakeVertexValue,
    UnableToMakeEdgeValue,
    UnableToMakePathValue,
    UnableToMakeValueString,
    UnableToMakeDateValue,
    UnableToMakeLocalTimeValue,
    UnableToMakeLocalDateTimeValue,
    UnableToMakeDurationValue,
    UnableToCopyVertex,
    OutOfBoundLabelIndexError,
    UnableToGetVertexProperty,
    UnableToReturnVertexPropertyMakeNameEror,
    UnableToReturnVertexPropertiesIterator,
    UnableToReturnVertexInEdgesIterator,
    UnableToReturnVertexOutEdgesIterator,
    UnableToReturnVertexLabelsCountDeletedObjectError,
    UnableToReturnVertexLabelDeletedObjectError,
    UnableToCheckVertexHasLabel,
}
```

#### Result

Defines a result type holding `Error` by default.

```rust
pub type Result<T, E = Error> = std::result::Result<T, E>;
```

- **T**: The type of the success value.
- **E**: The type of the error value (default is `Error`).

#### Date

##### new

Creates a new `Date`.

```rust
pub(crate) fn new(ptr: *mut mgp_date) -> Date
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_date`.
- **Returns**: A new instance of `Date`.

##### from_naive_date

Creates a `Date` from a `NaiveDate`.

```rust
pub fn from_naive_date(from: &NaiveDate, memgraph: &Memgraph) -> Result<Date>
```

- **Parameters**:
  - `from`: A reference to a `NaiveDate`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `Date` if successful.

##### to_naive_date

Converts the `Date` to a `NaiveDate`.

```rust
pub fn to_naive_date(&self) -> NaiveDate
```

- **Returns**: A `NaiveDate` representing the `Date`.

##### mgp_ptr

Returns the underlying `mgp_date` pointer.

```rust
pub fn mgp_ptr(&self) -> *mut mgp_date
```

- **Returns**: A pointer to `mgp_date`.

##### set_mgp_ptr

Sets a new `mgp_date` pointer.

```rust
pub fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_date)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_date`.

##### year

Returns the year of the `Date`.

```rust
pub fn year(&self) -> i32
```

- **Returns**: The year of the `Date`.

##### month

Returns the month of the `Date`.

```rust
pub fn month(&self) -> u32
```

- **Returns**: The month of the `Date`.

##### day

Returns the day of the `Date`.

```rust
pub fn day(&self) -> u32
```

- **Returns**: The day of the `Date`.

##### Drop

Drops the `Date` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### LocalTime

##### new

Creates a new `LocalTime`.

```rust
pub(crate) fn new(ptr: *mut mgp_local_time) -> LocalTime
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_local_time`.
- **Returns**: A new instance of `LocalTime`.

##### from_naive_time

Creates a `LocalTime` from a `NaiveTime`.

```rust
pub fn from_naive_time(from: &NaiveTime, memgraph: &Memgraph) -> Result<LocalTime>
```

- **Parameters**:
  - `from`: A reference to a `NaiveTime`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `LocalTime` if successful.

##### to_naive_time

Converts the `LocalTime` to a `NaiveTime`.

```rust
pub fn to_naive_time(&self) -> NaiveTime
```

- **Returns**: A `NaiveTime` representing the `LocalTime`.

##### mgp_ptr

Returns the underlying `mgp_local_time` pointer.

```rust
pub fn mgp_ptr(&self) -> *mut mgp_local_time
```

- **Returns**: A pointer to `mgp_local_time`.

##### set_mgp_ptr

Sets a new `mgp_local_time` pointer.

```rust
pub fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_local_time)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_local_time`.

##### hour

Returns the hour of the `LocalTime`.

```rust
pub fn hour(&self) -> u32
```

- **Returns**: The hour of the `LocalTime`.

##### minute

Returns the minute of the `LocalTime`.

```rust
pub fn minute(&self) -> u32
```

- **Returns**: The minute of the `LocalTime`.

##### second

Returns the second of the `LocalTime`.

```rust
pub fn second(&self) -> u32
```

- **Returns**: The second of the `LocalTime`.

##### millisecond

Returns the millisecond of the `LocalTime`.

```rust
pub fn millisecond(&self) -> u32
```

- **Returns**: The millisecond of the `LocalTime`.

##### microsecond

Returns the microsecond of the `LocalTime`.

```rust
pub fn microsecond(&self) -> u32
```

- **Returns**: The microsecond of the `LocalTime`.

##### timestamp

Returns the timestamp of the `LocalTime`.

```rust
pub fn timestamp(&self) -> i64
```

- **Returns**: The timestamp of the `LocalTime`.

##### Drop

Drops the `LocalTime` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### LocalDateTime

##### new

Creates a new `LocalDateTime`.

```rust
pub(crate) fn new(ptr: *mut mgp_local_date_time) -> LocalDateTime
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_local_date_time`.
- **Returns**: A new instance of `LocalDateTime`.

##### from_naive_date_time

Creates a `LocalDateTime` from a `NaiveDateTime`.

```rust
pub fn from_naive_date_time(from: &NaiveDateTime, memgraph: &Memgraph) -> Result<LocalDateTime>
```

- **Parameters**:
  - `from`: A reference to a `NaiveDateTime`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `LocalDateTime` if successful.

##### to_naive_date_time

Converts the `LocalDateTime` to a `NaiveDateTime`.

```rust
pub fn to_naive_date_time(&self) -> NaiveDateTime
```

- **Returns**: A `NaiveDateTime` representing the `LocalDateTime`.

##### mgp_ptr

Returns the underlying `mgp_local_date_time` pointer.

```rust
pub fn mgp_ptr(&self) -> *mut mgp_local_date_time
```

- **Returns**: A pointer to `mgp_local_date_time`.

##### set_mgp_ptr

Sets a new `mgp_local_date_time` pointer.

```rust
pub fn set_mgp_ptr(&mut self, new_ptr: *mut mgp_local_date_time)
```

- **Parameters**:
  - `new_ptr`: A new pointer to `mgp_local_date_time`.

##### year

Returns the year of the `LocalDateTime`.

```rust
pub fn year(&self) -> i32
```

- **Returns**: The year of the `LocalDateTime`.

##### month

Returns the month of the `LocalDateTime`.

```rust
pub fn month(&self) -> u32
```

- **Returns**: The month of the `LocalDateTime`.

##### day

Returns the day of the `LocalDateTime`.

```rust
pub fn day(&self) -> u32
```

- **Returns**: The day of the `LocalDateTime`.

##### hour

Returns the hour of the `LocalDateTime`.

```rust
pub fn hour(&self) -> u32
```

- **Returns**: The hour of the `LocalDateTime`.

##### minute

Returns the minute of the `LocalDateTime`.

```rust
pub fn minute(&self) -> u32
```

- **Returns**: The minute of the `LocalDateTime`.

##### second

Returns the second of the `LocalDateTime`.

```rust
pub fn second(&self) -> u32
```

- **Returns**: The second of the `LocalDateTime`.

##### millisecond

Returns the millisecond of the `LocalDateTime`.

```rust
pub fn millisecond(&self) -> u32
```

- **Returns**: The millisecond of the `LocalDateTime`.

##### microsecond

Returns the microsecond of the `LocalDateTime`.

```rust
pub fn microsecond(&self) -> u32
```

- **Returns**: The microsecond of the `LocalDateTime`.

##### Drop

Drops the `LocalDateTime` and releases the associated resources.

```rust
fn drop(&mut self)
```

#### Duration

##### new

Creates a new `Duration`.

```rust
pub(crate) fn new(ptr: *mut mgp_duration) -> Duration
```

- **Parameters**:
  - `ptr`: A pointer to `mgp_duration`.
- **Returns**: A new instance of `Duration`.

##### from_chrono_duration

Creates a `Duration` from a `chrono::Duration`.

```rust
pub fn from_chrono_duration(from: &chrono::Duration, memgraph: &Memgraph) -> Result<Duration>
```

- **Parameters**:
  - `from`: A reference to a `chrono::Duration`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing a new `Duration` if successful.

##### to_chrono_duration

Converts the `Duration` to a `chrono::Duration`.

```rust
pub fn to_chrono_duration(&self) -> chrono::Duration
```

#### Value

##### to_mgp_value

Converts a `Value` to a `MgpValue`.

```rust
pub fn to_mgp_value(&self, memgraph: &Memgraph) -> Result<MgpValue>
```

- **Parameters**:
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing the `MgpValue` if successful.

#### create_cstring

Creates a copy of the provided string.

```rust
pub(crate) unsafe fn create_cstring(c_char_ptr: *const c_char) -> Result<CString>
```

- **Parameters**:
  - `c_char_ptr`: A pointer to a C string.
- **Returns**: A `Result` containing a `CString` if successful.

#### mgp_raw_value_to_value

Creates a `Value` object from a `mgp_value` object.

```rust
pub(crate) unsafe fn mgp_raw_value_to_value(value: *mut mgp_value, memgraph: &Memgraph) -> Result<Value>
```

- **Parameters**:
  - `value`: A pointer to `mgp_value`.
  - `memgraph`: A reference to a `Memgraph` instance.
- **Returns**: A `Result` containing the `Value` if successful.

- **Safety**: Calls C API unsafe functions. The provided `mgp_value` object has to be a valid non-null pointer.

#### Enums

##### Value

Represents different types of values.

```rust
pub enum Value {
    Null,
    Bool(bool),
    Int(i64),
    Float(f64),
    String(CString),
    Vertex(Vertex),
    Edge(Edge),
    Path(Path),
    List(List),
    Map(Map),
    Date(NaiveDate),
    LocalTime(NaiveTime),
    LocalDateTime(NaiveDateTime),
    Duration(chrono::Duration),
}
```

- **Variants**:
  - `Null`: Represents a null value.
  - `Bool(bool)`: Represents a boolean value.
  - `Int(i64)`: Represents an integer value.
  - `Float(f64)`: Represents a floating-point value.
  - `String(CString)`: Represents a string value.
  - `Vertex(Vertex)`: Represents a vertex value.
  - `Edge(Edge)`: Represents an edge value.
  - `Path(Path)`: Represents a path value.
  - `List(List)`: Represents a list value.
  - `Map(Map)`: Represents a map value.
  - `Date(NaiveDate)`: Represents a date value.
  - `LocalTime(NaiveTime)`: Represents a local time value.
  - `LocalDateTime(NaiveDateTime)`: Represents a local date-time value.
  - `Duration(chrono::Duration)`: Represents a duration value.
