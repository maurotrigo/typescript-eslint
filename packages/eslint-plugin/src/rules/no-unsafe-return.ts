import * as util from '../util';
import { TSESTree } from '@typescript-eslint/experimental-utils';

export default util.createRule({
  name: 'no-unsafe-return',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows returning any from a function',
      category: 'Possible Errors',
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      unsafeReturn: 'Unsafe return of an {{type}} typed value',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = util.getParserServices(context);
    const checker = program.getTypeChecker();

    function checkReturn(
      node: TSESTree.Node,
      reportingNode: TSESTree.Node = node,
    ): void {
      const tsNode = esTreeNodeToTSNodeMap.get(node);
      const anyType = util.isAnyOrAnyArrayTypeDiscriminated(tsNode, checker);
      if (anyType !== util.AnyType.Safe) {
        context.report({
          node: reportingNode,
          messageId: 'unsafeReturn',
          data: {
            type: anyType === util.AnyType.Any ? 'any' : 'any[]',
          },
        });
      }
    }

    return {
      ReturnStatement(node): void {
        const argument = node.argument;
        if (!argument) {
          return;
        }

        checkReturn(argument, node);
      },
      'ArrowFunctionExpression > :not(BlockStatement).body': checkReturn,
    };
  },
});
