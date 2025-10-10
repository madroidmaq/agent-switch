import React, { useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import TextInput from 'ink-text-input';
import type { Preset } from '../core/types';
import { theme } from '../constants/theme';
import { generateServiceId, isValidUrl, isEmpty } from '../utils/formatters';

interface AddServiceFormProps {
  onSubmit: (data: { id: string; preset: Preset }) => void;
  onCancel: () => void;
}

type FormStep = 'name' | 'baseUrl' | 'token' | 'model' | 'smallModel' | 'confirm';

/**
 * Add service form component
 */
export const AddServiceForm: React.FC<AddServiceFormProps> = ({ onSubmit, onCancel }) => {
  const { exit } = useApp();

  const [step, setStep] = useState<FormStep>('name');
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    token: '',
    model: '',
    smallModel: '',
  });
  const [error, setError] = useState<string>('');

  // Handle Esc to cancel
  useInput((input, key) => {
    if (key.escape) {
      onCancel();
    }
  });

  const handleNext = (value: string, currentStep: FormStep) => {
    setError('');

    // Validate current input
    if (currentStep === 'name' && isEmpty(value)) {
      setError('Service name cannot be empty');
      return;
    }

    if (currentStep === 'baseUrl' && !isValidUrl(value)) {
      setError('Please enter a valid URL');
      return;
    }

    if (currentStep === 'token' && isEmpty(value)) {
      setError('Token cannot be empty');
      return;
    }

    if (currentStep === 'model' && isEmpty(value)) {
      setError('Model name cannot be empty');
      return;
    }

    if (currentStep === 'smallModel' && isEmpty(value)) {
      setError('Fast model name cannot be empty');
      return;
    }

    // Move to next step
    const stepSequence: FormStep[] = ['name', 'baseUrl', 'token', 'model', 'smallModel', 'confirm'];
    const currentIndex = stepSequence.indexOf(currentStep);

    if (currentIndex < stepSequence.length - 1) {
      setStep(stepSequence[currentIndex + 1]);
    }
  };

  const handleSubmit = () => {
    const id = generateServiceId(formData.name);

    onSubmit({
      id,
      preset: {
        env: {
          ANTHROPIC_BASE_URL: formData.baseUrl,
          ANTHROPIC_AUTH_TOKEN: formData.token,
          ANTHROPIC_MODEL: formData.model,
          ANTHROPIC_SMALL_FAST_MODEL: formData.smallModel,
        },
        forceLoginMethod: 'console',
      },
    });
  };

  return (
    <Box flexDirection="column" borderStyle="single" borderColor="cyan" paddingX={2} paddingY={1}>
      <Text bold color={theme.colors.primary}>
        {theme.icons.add} Add New Service
      </Text>

      <Box flexDirection="column" marginTop={1} gap={1}>
        {/* Service name */}
        <Box flexDirection="column">
          <Text color={step === 'name' ? 'white' : theme.colors.muted}>
            Service Name:{' '}
            {step === 'name' ? (
              <TextInput
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                onSubmit={(value) => handleNext(value, 'name')}
              />
            ) : (
              <Text>{formData.name}</Text>
            )}
          </Text>
        </Box>

        {/* API URL */}
        {(step === 'baseUrl' || stepSequence.indexOf(step) > stepSequence.indexOf('baseUrl')) && (
          <Box flexDirection="column">
            <Text color={step === 'baseUrl' ? 'white' : theme.colors.muted}>
              API URL:{' '}
              {step === 'baseUrl' ? (
                <TextInput
                  value={formData.baseUrl}
                  onChange={(value) => setFormData({ ...formData, baseUrl: value })}
                  onSubmit={(value) => handleNext(value, 'baseUrl')}
                  placeholder="https://..."
                />
              ) : (
                <Text>{formData.baseUrl}</Text>
              )}
            </Text>
          </Box>
        )}

        {/* API Token */}
        {(step === 'token' || stepSequence.indexOf(step) > stepSequence.indexOf('token')) && (
          <Box flexDirection="column">
            <Text color={step === 'token' ? 'white' : theme.colors.muted}>
              API Token:{' '}
              {step === 'token' ? (
                <TextInput
                  value={formData.token}
                  onChange={(value) => setFormData({ ...formData, token: value })}
                  onSubmit={(value) => handleNext(value, 'token')}
                  mask="*"
                />
              ) : (
                <Text dimColor>{'*'.repeat(20)}</Text>
              )}
            </Text>
          </Box>
        )}

        {/* Main model */}
        {(step === 'model' || stepSequence.indexOf(step) > stepSequence.indexOf('model')) && (
          <Box flexDirection="column">
            <Text color={step === 'model' ? 'white' : theme.colors.muted}>
              Model:{' '}
              {step === 'model' ? (
                <TextInput
                  value={formData.model}
                  onChange={(value) => setFormData({ ...formData, model: value })}
                  onSubmit={(value) => handleNext(value, 'model')}
                  placeholder="claude-sonnet-4"
                />
              ) : (
                <Text>{formData.model}</Text>
              )}
            </Text>
          </Box>
        )}

        {/* Fast model */}
        {(step === 'smallModel' || step === 'confirm') && (
          <Box flexDirection="column">
            <Text color={step === 'smallModel' ? 'white' : theme.colors.muted}>
              Fast Model:{' '}
              {step === 'smallModel' ? (
                <TextInput
                  value={formData.smallModel}
                  onChange={(value) => setFormData({ ...formData, smallModel: value })}
                  onSubmit={(value) => {
                    setFormData({ ...formData, smallModel: value });
                    handleNext(value, 'smallModel');
                  }}
                  placeholder="claude-3-5-haiku"
                />
              ) : (
                <Text>{formData.smallModel}</Text>
              )}
            </Text>
          </Box>
        )}

        {/* Confirmation step */}
        {step === 'confirm' && (
          <Box flexDirection="column" marginTop={1}>
            <Text color={theme.colors.success}>
              ✓ Configuration complete! Press Enter to save, Esc to cancel
            </Text>
            <TextInput
              value=""
              onChange={() => {}}
              onSubmit={handleSubmit}
            />
          </Box>
        )}

        {/* Error message */}
        {error && (
          <Box marginTop={1}>
            <Text color={theme.colors.error}>{theme.icons.error} {error}</Text>
          </Box>
        )}

        {/* Hint */}
        {step !== 'confirm' && (
          <Box marginTop={1}>
            <Text color={theme.colors.muted} dimColor>
              Press Enter to continue, Esc to cancel
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Define step sequence
const stepSequence: FormStep[] = ['name', 'baseUrl', 'token', 'model', 'smallModel', 'confirm'];
