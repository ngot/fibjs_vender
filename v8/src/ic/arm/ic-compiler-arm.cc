#include "src/v8.h"

#if V8_TARGET_ARCH_ARM

// Copyright 2014 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#if V8_TARGET_ARCH_ARM

#include "src/ic/ic.h"
#include "src/ic/ic-compiler.h"

namespace v8 {
namespace internal {

#define __ ACCESS_MASM(masm)


void PropertyICCompiler::GenerateRuntimeSetProperty(
    MacroAssembler* masm, LanguageMode language_mode) {
  __ Push(StoreDescriptor::ReceiverRegister(), StoreDescriptor::NameRegister(),
          StoreDescriptor::ValueRegister());

  __ mov(r0, Operand(Smi::FromInt(language_mode)));
  __ Push(r0);

  // Do tail-call to runtime routine.
  __ TailCallRuntime(Runtime::kSetProperty);
}


#undef __
}  // namespace internal
}  // namespace v8

#endif  // V8_TARGET_ARCH_ARM


#endif  // V8_TARGET_ARCH_ARM